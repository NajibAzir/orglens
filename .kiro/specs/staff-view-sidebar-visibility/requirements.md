# Requirements Document

## Introduction

OrgLens presents two personas: an HR/admin persona and a staff persona, selected through the persona value held in the application context. The Staff View sidebar currently lists `MY CAREER & UPSKILLING` first and exposes the `Role Evolution` page at `/roles`, which is intended for HR/admin users only.

This feature reorders the Staff View sidebar sections so structural navigation appears first, removes the `Role Evolution` navigation entry from the Staff View using the existing admin-only filter in the sidebar render loop, and blocks direct access to the Role Evolution routes for the staff persona so that hiding the link cannot be bypassed by entering a URL.

Scope is limited to the sidebar navigation definition and the Role Evolution route protection. The top navigation demo component `TopNavFull.jsx` contains an unfiltered `/top/roles` entry and is explicitly out of scope for this feature.

## Glossary

- **Sidebar**: The left-hand navigation component (`frontend/src/components/Sidebar.jsx`) that renders grouped navigation sections for the active persona.
- **Staff_View**: The state of the application in which the persona value provided by the application context equals `staff`.
- **Admin_View**: The state of the application in which the persona value provided by the application context equals `admin`.
- **Staff_Sections**: The ordered list of sidebar navigation sections rendered while the application is in Staff_View.
- **Admin_Only_Item**: A sidebar navigation item whose definition carries the `adminOnly` flag set to `true`.
- **Role_Evolution_Routes**: The application routes `/roles` (Role Evolution list) and `/roles/:id` (Role Evolution detail).
- **Route_Guard**: The routing-level access control component that determines whether a requested route renders its page or an alternative outcome based on the active persona.
- **HR_Only_Notice**: A visible message stating that the requested page is restricted to HR/admin users.

## Requirements

### Requirement 1: Staff View Sidebar Section Ordering

**User Story:** As a staff user, I want structural navigation listed before my personal career sections, so that I reach the org chart without scrolling past personal items.

#### Acceptance Criteria

1. WHILE the application is in Staff_View, THE Sidebar SHALL render Staff_Sections in the order `STRUCTURE & ROLES`, `MY CAREER & UPSKILLING`, `CARE & WELLBEING`.
2. WHILE the application is in Staff_View, THE Sidebar SHALL render the section label `STRUCTURE & ROLES` with that exact text.
3. WHILE the application is in Staff_View, THE Sidebar SHALL render the `Interactive Org Chart` item linking to `/org-chart` inside the `STRUCTURE & ROLES` section.
4. WHILE the application is in Staff_View, THE Sidebar SHALL render the `MY CAREER & UPSKILLING` section containing the items `My Career Journey`, `My Upskill Plan`, and `My Role Relevancy`.
5. WHILE the application is in Staff_View, THE Sidebar SHALL render the `CARE & WELLBEING` section containing the item `My Wellbeing Check-ins`.
6. WHILE the application is in Admin_View, THE Sidebar SHALL render the same section order and item set that the Sidebar renders before this feature is applied.

### Requirement 2: HR-Only Role Evolution Navigation Item

**User Story:** As an HR administrator, I want the Role Evolution navigation entry restricted to the HR/admin persona, so that staff users see only navigation relevant to their role.

#### Acceptance Criteria

1. WHILE the application is in Staff_View, THE Sidebar SHALL omit every navigation item linking to `/roles`.
2. THE Sidebar SHALL mark the Staff_Sections `Role Evolution` item as an Admin_Only_Item rather than deleting the item definition.
3. WHILE the application is in Staff_View, THE Sidebar SHALL omit every Admin_Only_Item from the rendered navigation.
4. WHILE the application is in Admin_View, THE Sidebar SHALL render the `Role Evolution & History` item linking to `/roles`.
5. IF a rendered Sidebar section contains zero visible items after Admin_Only_Item filtering, THEN THE Sidebar SHALL omit that section label from the rendered navigation.

### Requirement 3: Role Evolution Route Protection

**User Story:** As an HR administrator, I want direct navigation to Role Evolution blocked for staff users, so that hiding the sidebar link cannot be bypassed by entering a URL.

#### Acceptance Criteria

1. WHILE the application is in Staff_View, WHEN a request for a route in Role_Evolution_Routes is resolved, THE Route_Guard SHALL prevent the Role Evolution page from rendering.
2. WHILE the application is in Staff_View, WHEN a request for a route in Role_Evolution_Routes is resolved, THE Route_Guard SHALL present either a redirect to the Staff_View landing route or the HR_Only_Notice.
3. WHERE the Route_Guard presents the HR_Only_Notice, THE Route_Guard SHALL include a navigation control that returns the staff user to a route permitted in Staff_View.
4. WHILE the application is in Admin_View, WHEN a request for a route in Role_Evolution_Routes is resolved, THE Route_Guard SHALL render the requested Role Evolution page.
5. WHEN the persona value changes from `admin` to `staff` while a route in Role_Evolution_Routes is displayed, THE Route_Guard SHALL apply the Staff_View outcome defined in acceptance criteria 3.1 and 3.2 without requiring a page reload.
6. THE Route_Guard SHALL leave the rendering behaviour of routes outside Role_Evolution_Routes unchanged.

### Requirement 4: Change Scope Constraints

**User Story:** As a developer, I want the change confined to the sidebar definition and the Role Evolution route guard, so that unrelated navigation surfaces stay stable and reviewable.

#### Acceptance Criteria

1. THE Sidebar SHALL keep the existing Admin_Only_Item filtering logic in the render loop as the mechanism for persona-based item visibility.
2. THE Route_Guard SHALL derive the active persona from the application context persona value.
3. THE feature SHALL leave the `/top/roles` navigation item in `TopNavFull.jsx` unmodified and record that item as follow-up work.
