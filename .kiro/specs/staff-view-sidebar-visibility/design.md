# Design Document

## Overview

Two changes, both narrow:

1. **Sidebar data reshape** — reorder the `staffSections` array in `frontend/src/components/Sidebar.jsx` so `STRUCTURE & ROLES` comes first, and tag the staff `Role Evolution` item with `adminOnly: true`. No render-loop changes: the existing filter (`section.items.filter(item => !item.adminOnly || persona === 'admin')`) plus the existing `if (visibleItems.length === 0) return null;` guard already implement item-level and section-level omission. This feature is the first consumer of that filter.

2. **A new route-level guard** — `frontend/src/components/AdminOnlyRoute.jsx`, a small wrapper that reads `persona` from `AppContext` and either renders its children (admin) or an HR-only notice (staff). Applied to `/roles` and `/roles/:id` in `App.jsx`. `RoleHistory.jsx` and `RoleDetail.jsx` stay persona-unaware.

The guard is a new pattern for this codebase. Existing persona conditionals live inside pages (`WellbeingDashboard.jsx`, `PersonJourney.jsx`). An in-page conditional would work for `/roles` but would need duplicating in `RoleDetail.jsx` and every future HR-only page, and it leaves the page component responsible for its own access control. A wrapper keeps the rule in one place and composes at the route table, where the reader can see which routes are restricted.

## Architecture

```
AppProvider (persona)
  └── App
        ├── Sidebar ────────────────── persona → sections + adminOnly filter
        └── Routes
              ├── /roles      → <AdminOnlyRoute><RoleHistory /></AdminOnlyRoute>
              ├── /roles/:id  → <AdminOnlyRoute><RoleDetail /></AdminOnlyRoute>
              └── (all other routes unchanged)
```

Both the sidebar and the guard read the same `persona` value from context, so link visibility and route access can never disagree. Because `persona` is React state in `AppProvider`, a change via `PersonaToggle` re-renders both subtrees in the same commit — the guard swaps to the notice with no reload, satisfying requirement 3.5 with no extra machinery.

### Blocked-access outcome: notice, not redirect

Requirement 3.2 permits either a redirect to the staff landing route or the HR-only notice. This design uses the **notice**.

A silent redirect would drop a staff user onto an unrelated page with no explanation of what happened. The notice explains the restriction and offers a way forward, and it also means a persona switch while sitting on `/roles` produces a visible, comprehensible state change rather than the URL mutating underneath the user. The notice includes a link to `/org-chart` — present in Staff_View's first section, so it is always a permitted destination (requirement 3.3).

## Components and Interfaces

### `AdminOnlyRoute` (new)

```jsx
// frontend/src/components/AdminOnlyRoute.jsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function AdminOnlyRoute({ children }) {
  const { persona } = useContext(AppContext);

  if (persona === 'admin') return children;

  return <HrOnlyNotice />;
}
```

Contract:

| Aspect | Behaviour |
| --- | --- |
| Input | `children` — the page element(s) to protect |
| Persona source | `persona` from `AppContext` (requirement 4.2) |
| `persona === 'admin'` | Returns `children` untouched — no wrapper markup, no layout shift |
| `persona !== 'admin'` | Returns `HrOnlyNotice`; `children` are never mounted, so their data fetches never fire |
| Persona transition | Plain context consumer; re-renders on `persona` change, no reload (requirement 3.5) |
| Scope | Only routes explicitly wrapped in `App.jsx` are affected (requirement 3.6) |

Treating any non-`admin` persona as restricted (rather than testing `persona === 'staff'`) means a future third persona is denied by default instead of silently gaining access.

`children` is returned directly rather than wrapped in a fragment so the guard adds nothing to the DOM on the admin path.

### `HrOnlyNotice`

Co-located in `AdminOnlyRoute.jsx` — it has no other consumer, and splitting it into its own file would spread a 25-line presentational block across two modules for no gain. If a second guard needs it, extract then.

Styling mirrors the empty-state card in `WellbeingDashboard.jsx` (staff branch) so the notice reads as part of the app rather than an error screen:

```jsx
function HrOnlyNotice() {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white/90 dark:bg-[#0C1527]/70 backdrop-blur-xl p-8 rounded-3xl
                      border border-slate-200 dark:border-white/10 text-center
                      shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]">
        <ShieldAlert size={40} className="text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight">
          HR / Admin Access Only
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1.5">
          Role Evolution &amp; History is restricted to HR and admin users.
          Switch to Admin / HR mode to view organisational role changes.
        </p>
        <Link
          to="/org-chart"
          className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-2xl text-[13px] font-bold
                     bg-gradient-to-r from-setel-500 to-setel-600
                     dark:from-cyan-400 dark:to-blue-500 text-slate-950
                     shadow-md shadow-setel-500/20 dark:shadow-[0_0_20px_rgba(0,191,255,0.35)]
                     hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={15} />
          Back to Org Chart
        </Link>
      </div>
    </div>
  );
}
```

Conventions followed: `setel-*` palette for the light-mode accent with `dark:` cyan/blue counterparts, matching the sidebar's active `NavLink` gradient; card surface and radii copied from existing dashboard cards; amber icon marks restriction without the alarm of rose, which the codebase reserves for errors. The `Link` is a real anchor, so it is keyboard-focusable and screen-reader-navigable without extra ARIA.

### `Sidebar` — `staffSections` reshape

Reordered, with `Role Evolution` retained and flagged rather than deleted (requirement 2.2), so the HR-only decision stays visible in the source and is reversible by flipping one boolean:

```jsx
const staffSections = [
  {
    label: 'STRUCTURE & ROLES',
    items: [
      { name: 'Interactive Org Chart', path: '/org-chart', icon: Network },
      { name: 'Role Evolution', path: '/roles', icon: History, adminOnly: true },
    ]
  },
  {
    label: 'MY CAREER & UPSKILLING',
    items: [
      { name: 'My Career Journey', path: `/people/${staffEmployeeId}`, icon: Users },
      { name: 'My Upskill Plan', path: '/my-upskill', icon: BookOpen, badge: 'Plan', badgeType: 'live' },
      { name: 'My Role Relevancy', path: '/my-relevancy', icon: TrendingUp, badge: 'AI', badgeType: 'ai' },
    ]
  },
  {
    label: 'CARE & WELLBEING',
    items: [
      { name: 'My Wellbeing Check-ins', path: '/wellbeing', icon: HeartPulse },
    ]
  }
];
```

`adminOnly` is the only new key. `STRUCTURE & ROLES` retains a visible item (`Interactive Org Chart`) after filtering, so the section label still renders in Staff_View; the existing zero-visible-items guard covers the case where a future section becomes fully admin-only (requirement 2.5).

`adminSections` is untouched (requirement 1.6).

### `App.jsx` route table

```jsx
<Route path="/roles" element={<AdminOnlyRoute><RoleHistory /></AdminOnlyRoute>} />
<Route path="/roles/:id" element={<AdminOnlyRoute><RoleDetail /></AdminOnlyRoute>} />
```

Wrapping both entries — rather than only `/roles` — closes the direct-URL path to `/roles/7`, which is the bypass requirement 3 exists to prevent. All other `<Route>` entries are unchanged.

## Data Models

### Navigation item

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | Label text |
| `path` | string | React Router target |
| `icon` | component | lucide-react icon |
| `badge` | string? | Optional pill text |
| `badgeType` | `'live' \| 'ai'`? | Selects `badgeStyles` entry |
| `adminOnly` | boolean? | Absent/`false` → visible to all personas; `true` → admin only |

`adminOnly` is optional and absent on all existing items — the filter's `!item.adminOnly` short-circuit treats `undefined` as visible, so no existing item needs touching.

### Navigation section

| Field | Type | Notes |
| --- | --- | --- |
| `label` | string | Uppercase group heading |
| `items` | item[] | Rendered in array order after filtering |

Order is positional in both arrays. No sort key, no priority field — array position is the ordering contract, which keeps the source readable as the navigation the user sees.

### Persona

`'admin' | 'staff'`, from `AppContext`. Not persisted (unchanged by this feature) — a page reload returns to the `'admin'` default. Worth knowing when testing route protection manually: reloading `/roles` in Staff View resets the persona to admin and the page renders. The guard is a UI-affordance boundary, not a security control; the API applies no persona authorisation.

## Error Handling

| Condition | Handling |
| --- | --- |
| Staff persona reaches a guarded route by link or URL | `HrOnlyNotice` renders; protected page never mounts, so no request is issued for HR-only data |
| Persona switches to `staff` while a guarded route is displayed | Guard re-renders to the notice in the same commit; no reload, no redirect, URL preserved |
| Persona switches to `admin` while the notice is displayed | Guard re-renders the protected page; the page's own effects run on mount as normal |
| Unrecognised persona value | Falls to the non-admin branch — access denied by default |
| A section's items are all filtered out | Existing `visibleItems.length === 0` guard omits the label; no empty heading |

Failure modes deliberately not handled: no error boundary is added around the guard (it renders no side effects and can't throw beyond what React Router already handles), and no toast or logging on denied access (the notice is the user-facing signal, and a denied navigation is expected behaviour, not an incident).

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Admin-only items are hidden from staff and preserved for admin

*For any* list of sidebar navigation items with arbitrary `adminOnly` flags, filtering for the staff persona SHALL yield exactly those items whose `adminOnly` flag is absent or false, in their original relative order, while filtering for the admin persona SHALL yield the input list unchanged.

**Validates: Requirements 2.1, 2.3, 2.4**

### Property 2: Sections are labelled if and only if they have a visible item

*For any* list of sidebar sections with arbitrary item compositions, a section's label SHALL appear in the rendered navigation exactly when that section contains at least one item visible to the active persona.

**Validates: Requirements 2.5**

### Property 3: Staff career journey link tracks the active staff employee

*For any* staff employee identifier held in application context, the Staff_View `My Career Journey` navigation item SHALL link to `/people/{that identifier}`.

**Validates: Requirements 1.4**

### Property 4: The guard admits admin and blocks staff on every guarded route

*For any* path in Role_Evolution_Routes — `/roles` and `/roles/{any identifier segment}` — the guard SHALL render the requested page when the persona is `admin`, and SHALL render the HR_Only_Notice without mounting the requested page when the persona is not `admin`.

**Validates: Requirements 3.1, 3.2, 3.4**

### Property 5: Persona transitions re-evaluate the guard without remounting

*For any* path in Role_Evolution_Routes, changing the context persona from `admin` to `staff` while that path is displayed SHALL replace the rendered page with the HR_Only_Notice, and changing it back SHALL restore the page, in both cases without a router remount or page reload.

**Validates: Requirements 3.5, 4.2**

### Property 6: The guard is transparent to unguarded routes

*For any* application route outside Role_Evolution_Routes and *for any* persona value, the rendered outcome SHALL be identical to the outcome before this feature is applied.

**Validates: Requirements 3.6**

## Testing Strategy

Property tests use `fast-check` with `@testing-library/react` under Vitest, minimum 100 iterations per property, each tagged:

```
Feature: staff-view-sidebar-visibility, Property {number}: {property text}
```

Properties 1 and 2 exercise the filter and section-omission logic against generated section/item structures — the highest-value generated-input targets here, since the filter is pure and arbitrary compositions catch order-preservation and empty-array mistakes. Property 4 generates route identifier segments (numeric, non-numeric, long, special characters) to confirm the `:id` route is guarded across the whole segment space, not just tidy numeric ids. Property 6 generates over the known route list to catch an over-broad path matcher.

Example-based tests, kept deliberately few, cover what has no input space to vary:

- Staff_View section labels render in the exact order `STRUCTURE & ROLES`, `MY CAREER & UPSKILLING`, `CARE & WELLBEING` (requirements 1.1, 1.2)
- `Interactive Org Chart` → `/org-chart` appears inside `STRUCTURE & ROLES` in Staff_View (requirement 1.3)
- `MY CAREER & UPSKILLING` contains the three expected item names; `CARE & WELLBEING` contains `My Wellbeing Check-ins` (requirements 1.4, 1.5)
- Admin_View navigation structure snapshot — labels plus item name/path pairs — as a regression guard (requirement 1.6)
- The staff `Role Evolution` definition still exists with `path: '/roles'` and `adminOnly: true` (requirement 2.2)
- `Role Evolution & History` → `/roles` renders in Admin_View (requirement 2.4)
- `HrOnlyNotice` renders a navigable control targeting a Staff_View-permitted route (requirement 3.3)

Not automated: requirement 4.1 (filter logic kept in the render loop) and 4.3 (`TopNavFull.jsx` untouched) are source-structure constraints, verified by diff review. Their behavioural consequences are covered by Properties 1 and 2.

## Follow-up Work

`frontend/src/components/TopNavFull.jsx` contains a `/top/roles` navigation item with no persona filter. It is out of scope for this feature (requirement 4.3) and is reached only from the `/top-nav-demo` route, which renders its own shell without the sidebar. Applying the same `adminOnly` treatment there — and deciding whether `/top/roles` should route through `AdminOnlyRoute` — is deferred to a separate change.
