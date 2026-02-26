# Tests

Unit tests covering the core service methods and component logic for each web part, written with **Jest**.

---

| Test file | Covers |
|-----------|--------|
| `DashboardApp.test.tsx` | Dashboard rendering, event retrieval and date filtering |
| `GroupManagement.test.tsx` | Group CRUD operations and membership join/leave actions |
| `PollManagement.test.tsx` | Poll voting submissions, analytics aggregation and chart config |
| `Profile.test.tsx` | Profile card rendering and user-suggestion logic |

---

## Running Tests

```bash
npm test
```

All tests run in an isolated environment — no SharePoint connection required.
