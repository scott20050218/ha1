# AccessToken 获取接口设计文档（后端服务对接）

基于 `ws.md` 中的能力：通过微信后台接口获取全局唯一的后台接口调用凭据（Access Token），有效期 7200s。该接口仅允许在服务器端调用。

## 1. 背景与目标

- 目标：提供稳定、可观测、可缓存的 AccessToken 获取与管理能力，供内部业务服务安全调用微信 API。
- 约束：
  - 仅服务器端可调用；
  - 不将 AppSecret 暴露到前端或客户端；
  - 支持多应用隔离（不同 appid 的 token 互不影响）。

## 2. 术语

- appid：应用唯一标识。
- appsecret：应用密钥。
- access_token：调用微信后台接口的凭证，有效期 7200s。

## 3. 外部接口（微信）

- 方法：HTTPS GET
- URL：`https://api.weixin.qq.com/cgi-bin/token`
- Query 参数：
  - `grant_type=client_credential`（固定值）
  - `appid=<APPID>`
  - `secret=<APPSECRET>`
- 成功响应示例：

```json
{ "access_token": "ACCESS_TOKEN", "expires_in": 7200 }
```

- 主要错误码：`40001/40013/40125/40164/40243/-1/...`（见 `ws.md`）

## 4. 内部服务设计

### 4.1 接口定义（服务对内提供）

- `POST /api/token/refresh`（仅管理员/CI 可用）
  - 功能：强制刷新并覆盖缓存。
- `GET /api/token`（内部网关/微服务使用）
  - 功能：读取缓存；若将过期或不存在，触发刷新（互斥）。
  - 响应：

```json
{
  "accessToken": "string",
  "expireAt": 1710000000,
  "appId": "string",
  "fromCache": true
}
```

### 4.2 配置与密钥管理

- 环境变量/密管：`WECHAT_APP_ID`、`WECHAT_APP_SECRET`（或多应用映射）。
- 严禁写入仓库；通过密钥管理服务（KMS/Secret Manager）下发。

### 4.3 缓存策略

- 缓存介质：Redis（首选）/进程内（降级）。
- Key：`wx:token:<appid>`，Value：`{"token":"..","expireAt":<unix>}`。
- 过期提前刷新：`expires_in - safetyWindow`（推荐安全窗 300s）。
- 并发互斥：使用分布式锁 `wx:token:lock:<appid>`，TTL 10s，避免惊群/雪崩。
- 失效降级：当外部接口短暂失败，若本地仍有未过期 token，则继续使用并告警。

### 4.4 重试与熔断

- 重试：对网络/5xx 使用指数退避（如 100ms、300ms、900ms，最多 3 次）。
- 不重试：`40001/40125/40243/40013` 等确定性错误，直接失败并记录。
- 熔断：连续错误阈值后短期拒绝新刷新请求（例如 30s），期间使用旧 token 并发出告警。

### 4.5 日志与监控

- 日志：
  - 请求时间、结果（成功/失败码）、耗时、appid、是否命中缓存。
  - 错误堆栈（屏蔽 `secret`）。
- 指标：
  - 刷新成功率、平均/95/99 刷新时延、缓存命中率、错误码分布、熔断状态。
- 告警：
  - 连续失败 N 次、被动刷新失败、错误码 `40164/40243` 等安全类。

### 4.6 安全

- 后端仅在内网调用微信接口；对外不暴露 `secret`。
- /api/token\* 接口需要网关鉴权与角色控制。
- 记录调用方服务标识（serviceName）与调用频率（rate limit）。

## 5. 时序流程（GET /api/token）

1. 调用方请求网关 → 服务 `TokenService.get(appid)`
2. 命中缓存且 `now < expireAt - safetyWindow` → 直接返回
3. 未命中或将过期 → 争抢分布式锁
4. 获锁者向微信发起刷新 → 校验响应 → 写入缓存（设置过期）
5. 释放锁并返回；未获锁者短暂等待后读缓存返回

## 6. 失败与兜底策略

- `-1 system error`：重试；多次失败进入熔断，并使用旧 token（若可用）
- `40001/40125/40013/40243`：配置或权限问题，立即告警并失败
- `40164`：IP 白名单问题，提示运维在微信后台配置服务器出口 IP

## 7. 代码示例（伪代码）

```ts
async function getAccessToken(
  appId: string
): Promise<{ token: string; expireAt: number }> {
  const cacheKey = `wx:token:${appId}`;
  const item = await redis.get(cacheKey);
  if (item && Date.now() < item.expireAt - 300_000) return item;

  const lock = await redis.lock(`wx:token:lock:${appId}`, 10_000);
  if (!lock.acquired) {
    await sleep(200);
    return await redis.get(cacheKey);
  }
  try {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${SECRET}`;
    const res = await http.get(url, { timeout: 3000 });
    if (res.status !== 200) throw new Error("NETWORK");
    const body = res.data;
    if (!body.access_token) throw new Error(`WX:${body.errcode || "UNKNOWN"}`);
    const expireAt = Date.now() + body.expires_in * 1000;
    const value = { token: body.access_token, expireAt };
    await redis.set(cacheKey, value, { PXAT: expireAt });
    return value;
  } finally {
    await lock.release();
  }
}
```

## 8. 本地/测试说明

- 可在沙箱/测试号环境验证获取逻辑；
- 使用假实现（mock）或环境开关避免在单元测试中访问真实微信接口；
- 对集成测试：注入测试 appid/secret，并验证缓存与锁行为。

## 9. 风险与边界

- 多应用隔离：不同 `appid` 独立缓存与锁 key；
- 时钟偏差：服务节点时间不同步会影响 `expireAt` 计算，需 NTP；
- 安全合规：密钥轮换流程、最小权限、访问审计；
- 扩展：可支持“稳定版 AccessToken”能力时的降噪与更长有效期策略（若开启）。

—— 完 ——
