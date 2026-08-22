# Implementation Plan: Staff View Sidebar Visibility

## Overview

Three source changes in the React (JavaScript/JSX) frontend, plus test coverage:

1. Reshape `staffSections` in `frontend/src/components/Sidebar.jsx` — `STRUCTURE & ROLES` first, staff `Role Evolution` flagged `adminOnly: true`. The existing render-loop filter and zero-visible-items guard are reused as-is.
2. Add `frontend/src/components/AdminOnlyRoute.jsx` — persona guard reading `AppContext`, with co-located `HrOnlyNotice`.
3. Wrap `/roles` and `/roles/:id` in `frontend/src/App.jsx`.

`frontend/package.json` currently has no test runner, so test tooling (Vitest, fast-check, `@testing-library/react`) is installed first. `TopNavFull.jsx` is out of scope.

## Tasks

- [ ] 1. Test tooling setup

  - [ ] 1.1 Add Vitest, fast-check, and Testing Library to the frontend
    - Add pinned devDependencies to `frontend/package.json`: `vitest`, `@vitest/ui` (optional), `jsdom`, `fast-check`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
    - Add `"test": "vitest --run"` and `"test:watch": "vitest"` scripts
    - Configure `test: { environment: 'jsdom', globals: true, setupFiles: './src/test/setup.js' }` in `frontend/vite.config.js`
    - Create `frontend/src/test/setup.js` importing `@testing-library/jest-dom/vitest`
    - Create `frontend/src/test/renderWithProviders.jsx` helper that mounts a component inside `AppContext.Provider` (configurable `persona`, `staffEmployeeId`) and `MemoryRouter` (configurable `initialEntries`)
    - _Requirements: supports verification of 1.1-3.6_

- [ ] 2. Sidebar navigation reshape

  - [ ] 2.1 Reorder `staffSections` and flag `Role Evolution` as admin-only
    - In `frontend/src/components/Sidebar.jsx`, order the staff sections `STRUCTURE & ROLES`, `MY CAREER & UPSKILLING`, `CARE & WELLBEING`
    - `STRUCTURE & ROLES` holds `Interactive Org Chart` → `/org-chart` and `Role Evolution` → `/roles` with `adminOnly: true` (definition retained, not deleted)
    - Leave `adminSections`, the `section.items.filter(...)` call, and the `visibleItems.length === 0` guard untouched
    - Add named exports for the section definitions and the item-visibility predicate so tests can drive them with generated input; the render loop stays the only production consumer
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.3, 2.4, 2.5, 4.1_

  - [ ]* 2.2 Write property test for admin-only item filtering
    - **Property 1: Admin-only items are hidden from staff and preserved for admin**
    - File `frontend/src/components/__tests__/Sidebar.visibility.property.test.jsx`, fast-check over generated item lists with arbitrary `adminOnly` flags, 100+ runs, assert order preservation for staff and identity for admin
    - Tag: `Feature: staff-view-sidebar-visibility, Property 1: ...`
    - **Validates: Requirements 2.1, 2.3, 2.4**

  - [ ]* 2.3 Write property test for section label omission
    - **Property 2: Sections are labelled if and only if they have a visible item**
    - File `frontend/src/components/__tests__/Sidebar.sections.property.test.jsx`, fast-check over generated section/item compositions including all-admin-only and empty sections, 100+ runs
    - Tag: `Feature: staff-view-sidebar-visibility, Property 2: ...`
    - **Validates: Requirements 2.5**

  - [ ]* 2.4 Write property test for the staff career journey link
    - **Property 3: Staff career journey link tracks the active staff employee**
    - File `frontend/src/components/__tests__/Sidebar.careerLink.property.test.jsx`, generate `staffEmployeeId` values via context and assert the `My Career Journey` href is `/people/{id}`, 100+ runs
    - Tag: `Feature: staff-view-sidebar-visibility, Property 3: ...`
    - **Validates: Requirements 1.4**

  - [ ]* 2.5 Write example tests for sidebar structure
    - File `frontend/src/components/__tests__/Sidebar.structure.test.jsx`
    - Staff View renders labels in the exact order `STRUCTURE & ROLES`, `MY CAREER & UPSKILLING`, `CARE & WELLBEING`
    - `Interactive Org Chart` → `/org-chart` sits inside `STRUCTURE & ROLES`; no rendered item links to `/roles` in Staff View
    - `MY CAREER & UPSKILLING` contains the three expected items; `CARE & WELLBEING` contains `My Wellbeing Check-ins`
    - Staff `Role Evolution` definition still exists with `path: '/roles'` and `adminOnly: true`
    - Admin View renders `Role Evolution & History` → `/roles`, plus a label/item-path snapshot as a regression guard
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2.1, 2.2, 2.4_

- [ ] 3. Checkpoint - sidebar behaviour verified
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Admin-only route guard

  - [ ] 4.1 Create `AdminOnlyRoute` with co-located `HrOnlyNotice`
    - New file `frontend/src/components/AdminOnlyRoute.jsx`
    - Read `persona` from `AppContext`; return `children` directly when `persona === 'admin'`, otherwise render `HrOnlyNotice` so protected children never mount
    - `HrOnlyNotice`: card styled after the `WellbeingDashboard.jsx` staff empty state, `ShieldAlert` amber icon, restriction heading and explanation, and a `react-router-dom` `Link` to `/org-chart` labelled "Back to Org Chart"
    - Treat any non-`admin` persona as restricted (deny by default)
    - _Requirements: 3.1, 3.2, 3.3, 4.2_

  - [ ]* 4.2 Write example test for the notice's navigation control
    - File `frontend/src/components/__tests__/AdminOnlyRoute.notice.test.jsx`
    - Assert the notice renders an anchor targeting `/org-chart`, a Staff_View-permitted route, and that it is keyboard-focusable
    - _Requirements: 3.3_

- [ ] 5. Route wiring and guard verification

  - [ ] 5.1 Wrap the Role Evolution routes in `App.jsx`
    - In `frontend/src/App.jsx`, wrap the `/roles` element in `<AdminOnlyRoute><RoleHistory /></AdminOnlyRoute>` and the `/roles/:id` element in `<AdminOnlyRoute><RoleDetail /></AdminOnlyRoute>`
    - Leave every other `<Route>` entry and both page components persona-unaware
    - _Requirements: 3.1, 3.2, 3.4, 3.6_

  - [ ]* 5.2 Write property test for guard admission and denial
    - **Property 4: The guard admits admin and blocks staff on every guarded route**
    - File `frontend/src/components/__tests__/AdminOnlyRoute.guard.property.test.jsx`, generate `:id` segments (numeric, non-numeric, long, special characters) for `/roles/{id}` plus the bare `/roles` path, 100+ runs; assert page renders for admin and the notice renders without mounting the page for staff
    - Tag: `Feature: staff-view-sidebar-visibility, Property 4: ...`
    - **Validates: Requirements 3.1, 3.2, 3.4**

  - [ ]* 5.3 Write property test for persona transitions
    - **Property 5: Persona transitions re-evaluate the guard without remounting**
    - File `frontend/src/components/__tests__/AdminOnlyRoute.personaTransition.property.test.jsx`, generate guarded paths, flip context persona `admin` → `staff` → `admin` on a mounted tree, assert the swap to the notice and back with no router remount or reload
    - Tag: `Feature: staff-view-sidebar-visibility, Property 5: ...`
    - **Validates: Requirements 3.5, 4.2**

  - [ ]* 5.4 Write property test for unguarded route transparency
    - **Property 6: The guard is transparent to unguarded routes**
    - File `frontend/src/components/__tests__/Routes.unguarded.property.test.jsx`, generate over the known non-`/roles` route list for both personas and assert no `HrOnlyNotice` appears and the expected page renders, catching an over-broad path matcher
    - Tag: `Feature: staff-view-sidebar-visibility, Property 6: ...`
    - **Validates: Requirements 3.6**

- [ ] 6. Final checkpoint - full suite green
  - Ensure all tests pass, ask the user if questions arise.
  - Confirm by diff review that the filter logic remains in the sidebar render loop (requirement 4.1) and that `TopNavFull.jsx` is unmodified (requirement 4.3)

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Requirements 4.1 and 4.3 are source-structure constraints verified by diff review, not automated tests
- The guard is a UI-affordance boundary; the API applies no persona authorisation, and `persona` is not persisted, so a reload of `/roles` resets to the `admin` default
- `/top/roles` in `TopNavFull.jsx` is deferred follow-up work

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "4.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "2.4", "2.5", "4.2", "5.1"] },
    { "id": 3, "tasks": ["5.2", "5.3", "5.4"] }
  ]
}
```
