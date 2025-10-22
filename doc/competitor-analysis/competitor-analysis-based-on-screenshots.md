# Competitor Feature Analysis Report Based on Screenshots (p1–p4)

Note: The following analysis is based on visible interface elements and common interaction patterns from screenshots in the `doc/competitor-analysis/` directory (p1.jpg, p2.jpg, p3.jpg, p4.jpg) for inductive inference; capabilities that cannot be confirmed from static screenshots are marked as "To be verified".

## I. Overall Positioning and Information Architecture Impression

- Navigation hierarchy: Left main navigation (Projects/Board/Progress/Alerts/Reports, etc.), top toolbar (Search, Import, Create New).
- Page types:
  - Workspace/Project overview page (metric cards + quick filters);
  - Board page (multi-column status, task cards, column statistics/charts);
  - Timeline/Gantt (milestones, dependencies, planned/actual comparison);
  - Alert/Message page (risk list, subscription/notification actions).
- Visual and layout: Card-style information containers, obvious whitespace; list/cards + right clear information area; top unified search/CTA area.

## II. Feature List (Categorized by Module)

### 2.1 Project/Task Foundation

- Projects: Create/edit/archive, manager/members (visible from top and card elements), project status/tags (inferred).
- Tasks:
  - Basic fields: Title, status (not started/in progress/blocked/completed), manager, progress percentage (screenshot shows "Progress xx%").
  - Interaction: Displayed as "task cards" within columns; list items show Owner/status badges on the right.
  - Grouping: By status columns (column headers like "Not Started/In Progress/Blocked/Completed").
  - Subtasks/checklist (To be verified: screenshots don't show collapse icons intuitively).
- Dependencies/milestones (To be verified: may be presented on timeline page).

### 2.2 Views and Visualization

- Board view:
  - Column management: Multiple columns side by side, column headers, cards within columns; consistent card style (rounded corners, shadows, tags).
  - Statistics: Visualizations above columns or in additional card areas (inferred from other screenshots showing chart cards like pie/bar/line).
  - Drag and drop (To be verified: screenshots don't show drag handles, conventional boards default to support).
- Reports/Charts:
  - Pie chart: Status distribution (not started/in progress/blocked/completed).
  - Bar chart: Number of tasks per column/per capita in progress.
  - Line chart: Recent 7-day completion/creation trend.
  - Burn-down/burn-up (To be verified).
- Timeline/Gantt (inferred from "progress/time-related screenshots"):
  - Planned vs actual, task bars/critical path (To be verified).

### 2.3 Search, Filtering and Export

- Top global search: Placeholder "Search projects/tasks/members...".
- Conditional filtering:
  - Manager/status/department (inferred from filter control styles and options).
  - Time range (To be verified).
- Export capability: CSV/Excel (buttons "Export"/"Export CSV").
- Save views (To be verified).

### 2.4 Collaboration and Notifications

- Subscription/notifications:
  - Action button "Notify" appears on alert/reminder item cards (inferred to send reminders to relevant people).
- Comments/attachments (To be verified: screenshots don't show comment input areas).

### 2.5 Alerts and Risks

- Alert list:
  - Items include level (high/medium/info), description text, related objects (e.g., "API integration"), "Notify" action.
  - Risk types: Progress lag, dependencies incomplete, due reminders, etc. (inferred from text).
- Alert generation logic (To be verified): Rules/AI; supports subscription scope (managers/members/subscribers).

### 2.6 Permissions and Roles (Cannot be fully confirmed from screenshots, inferred from common practices)

- Role hierarchy: Administrator, project manager, member, visitor/read-only.
- Access control: Project-level/task-level visibility, export permissions (To be verified).

### 2.7 Automation and Integration (To be verified)

- IM integration: Enterprise WeChat/Feishu Webhook (inferred from "notify" and Chinese enterprise scenarios).
- Rule triggers: Status changes/due → notify/assign/change fields (inferred from alert text).

## III. Page Breakdown Based on Screenshots

### 3.1 Top Toolbar Area

- Components: Logo + title, global search, import button, create new project button (main CTA).
- Design logic:
  - Place high-frequency operations (search, create) in fixed positions;
  - Import entry near create, reducing migration cost from external systems.

### 3.2 Sidebar Navigation

- Grouping: Navigation title "Navigation", containing "Projects/Board/Progress/Alerts" entries.
- Design logic:
  - Task progression main view (board/timeline) as core, left primary structure stable presentation, mobile collapses to bottom (responsive).

### 3.3 Board Columns and Task Cards

- Columns: Not started, in progress, blocked, completed.
- Card elements: Title, progress percentage, Owner, status badge; cards with rounded corners + light shadows as information units.
- Design logic:
  - Unified card information skeleton, ensuring browsing density and clear hierarchy;
  - Dual encoding of progress and status, balancing overview and judgment;
  - Owner badge fixed position, reducing visual search cost.

### 3.4 Chart Cards (Above Board/Independent Area)

- Pie chart: Distribution at a glance (status/department/priority).
- Bar chart: In-progress/number per column comparison, easy to identify bottleneck columns.
- Line chart: Trends (recent 7 days or weekly), for monitoring short-term rhythm.
- Design logic:
  - "Overview → drill-down" path: first look at metrics/charts, then locate problems in board columns;
  - Multiple charts side by side, support mobile line breaks, ensure responsive layout.

### 3.5 Alert List

- List items: Level indicator (color), text, related object, notify button.
- Design logic:
  - Use prominent colors to distinguish levels (danger/warning/info);
  - Action proximity (notify within card), shortening processing path.

## IV. Design Logic and Trade-offs Behind

1. Task flow as main line, shortest path to "board/progress" view;
2. Overview (charts/metrics) → drill-down (columns/cards) → final processing (comments/notify/assign);
3. Use cardification to unify information density and visual rhythm, reducing visual burden;
4. Use lightweight statistics (pie/bar/line) to support "bottleneck identification/rhythm judgment", avoiding complex reports with high learning curve.

## V. Gap with Our Product and Implementation Suggestions

- Already available:
  - Board four columns, card information skeleton, chart trio (pie/bar/line), alert list, global search, export button.
- To enhance:
  - Drag-and-drop sorting and inter-column movement (need to introduce DnD library);
  - Task detail panel (right drawer: fields/comments/attachments);
  - Dependencies and milestones presentation on timeline (critical path highlighting);
  - Alert "factor explanation + one-click dispatch/delay exemption";
  - Filtering and save views (shared views/personal views).

## VI. Feature Comparison Based on Screenshots (Checked = visible from screenshots; To be verified = requires interaction confirmation)

- Projects: Create, import (checked); archive/template (to be verified)
- Tasks: Title/progress/status/manager (checked); subtasks/custom fields (to be verified)
- Board: Multi-column, cards, column statistics (checked); drag-and-drop, WIP limits (to be verified)
- Charts: Pie/bar/line (checked); burn-down/burn-up (to be verified)
- Timeline: Existence (to be verified); dependency lines/critical path (to be verified)
- Alerts: Level/text/one-click notify (checked); subscription dimensions/rule customization (to be verified)
- Permissions: Role hierarchy (to be verified)
- Integration: IM Webhook (to be verified)

## VII. Next Steps Verification Checklist (Interview/Usability Testing)

1. Whether board supports drag-and-drop and keyboard shortcuts;
2. Task detail panel field completeness and customization capability;
3. Whether timeline supports planned/actual comparison, dependencies/critical path;
4. Alert generation method (rules/AI) and explanation information;
5. Whether filtering can be saved/shared, whether export can select fields;
6. Permission model and audit capability;
7. Integration depth with IM/calendar/code repository.

---

If needed, I can merge this report with "competitor-feature-analysis-report.md" into a "Comprehensive Version" and form a maintainable checklist table from "checked/to be verified".
