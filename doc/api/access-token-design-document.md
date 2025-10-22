# AccessToken API Design Document (Backend Service Integration)

Based on the capabilities described in `ws.md`: Obtain globally unique backend API call credentials (Access Token) through WeChat backend API, valid for 7200s. This API is only allowed to be called on the server side.

## 1. Background and Objectives

- Objective: Provide stable, observable, and cacheable AccessToken acquisition and management capabilities for internal business services to securely call WeChat APIs.
- Constraints:
  - Only server-side calls are allowed;
  - Do not expose AppSecret to frontend or client;
  - Support multi-application isolation (tokens for different appids do not interfere with each other).

## 2. Terminology

- appid: Application unique identifier.
- appsecret: Application secret key.
- access_token: Credential for calling WeChat backend API, valid for 7200s.

## 3. External API (WeChat)

- Method: HTTPS GET
- URL: `https://api.weixin.qq.com/cgi-bin/token`
- Query Parameters:
  - `grant_type=client_credential` (fixed value)
  - `appid=<APPID>`
  - `secret=<APPSECRET>`
- Success Response Example:

```json
{ "access_token": "ACCESS_TOKEN", "expires_in": 7200 }
```

- Main Error Codes: `40001/40013/40125/40164/40243/-1/...` (see `ws.md`)

## 4. Internal Service Design

### 4.1 API Definition (Service Internal Interface)

- `POST /api/token/refresh` (Admin/CI only)
  - Function: Force refresh and overwrite cache.
- `GET /api/token` (Internal gateway/microservice usage)
  - Function: Read cache; if expired or non-existent, trigger refresh (mutex).
  - Response:

```json
{
  "accessToken": "string",
  "expireAt": 1710000000,
  "appId": "string",
  "fromCache": true
}
```

### 4.2 Configuration and Secret Management

- Environment variables/secret management: `WECHAT_APP_ID`, `WECHAT_APP_SECRET` (or multi-app mapping).
- Strictly prohibited from writing to repository; distributed through secret management service (KMS/Secret Manager).

### 4.3 Caching Strategy

- Cache medium: Redis (preferred)/in-process (fallback).
- Key: `wx:token:<appid>`, Value: `{"token":"..","expireAt":<unix>}`.
- Early refresh before expiration: `expires_in - safetyWindow` (recommended safety window 300s).
- Concurrency mutex: Use distributed lock `wx:token:lock:<appid>`, TTL 10s, avoid thundering herd/avalanche.
- Failure degradation: When external API temporarily fails, if local still has unexpired token, continue using and alert.

### 4.4 Retry and Circuit Breaker

- Retry: Use exponential backoff for network/5xx errors (e.g., 100ms, 300ms, 900ms, max 3 times).
- No retry: Deterministic errors like `40001/40125/40243/40013`, fail directly and log.
- Circuit breaker: After consecutive error threshold, temporarily reject new refresh requests (e.g., 30s), use old token during this period and alert.

### 4.5 Logging and Monitoring

- Logs:
  - Request time, result (success/failure code), duration, appid, cache hit status.
  - Error stack (mask `secret`).
- Metrics:
  - Refresh success rate, average/95/99 refresh latency, cache hit rate, error code distribution, circuit breaker status.
- Alerts:
  - Consecutive failures N times, passive refresh failure, security-related error codes like `40164/40243`.

### 4.6 Security

- Backend only calls WeChat API within internal network; do not expose `secret` externally.
- /api/token\* interfaces require gateway authentication and role control.
- Record caller service identifier (serviceName) and call frequency (rate limit).

## 5. Sequence Flow (GET /api/token)

1. Caller requests gateway → Service `TokenService.get(appid)`
2. Cache hit and `now < expireAt - safetyWindow` → Return directly
3. Cache miss or about to expire → Compete for distributed lock
4. Lock holder initiates refresh to WeChat → Validate response → Write to cache (set expiration)
5. Release lock and return; non-lock holders wait briefly then read cache and return

## 6. Failure and Fallback Strategy

- `-1 system error`: Retry; enter circuit breaker after multiple failures, use old token (if available)
- `40001/40125/40013/40243`: Configuration or permission issues, alert immediately and fail
- `40164`: IP whitelist issue, prompt operations to configure server egress IP in WeChat backend

## 7. Code Example (Pseudocode)

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

## 8. Local/Testing Instructions

- Can verify acquisition logic in sandbox/test account environment;
- Use mock implementation or environment switches to avoid accessing real WeChat API in unit tests;
- For integration tests: Inject test appid/secret and verify cache and lock behavior.

## 9. Risks and Boundaries

- Multi-application isolation: Different `appid` independent cache and lock keys;
- Clock skew: Service node time desynchronization affects `expireAt` calculation, requires NTP;
- Security compliance: Secret rotation process, minimum privilege, access audit;
- Extension: Can support "stable AccessToken" capability with noise reduction and longer validity period strategy (if enabled).

—— End ——
