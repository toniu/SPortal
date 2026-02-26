# SPortal — SharePoint Intranet Web Parts

A collection of SPFx web parts built with React and TypeScript for managing users, groups, events, polls and profiles within a SharePoint Online portal.

**Tech stack:** SPFx 1.16, TypeScript, React, PnPjs, Jest, Gulp, SharePoint Lists

---

## Features

### Calendar
Full event lifecycle — create, edit, delete and browse events with location search (maps integration) and recurring event support.

![calendar-1](release/deliverables/demos/calendar/screenshots/add-edit-event.png)
![calendar-2](release/deliverables/demos/calendar/screenshots/delete-event.png)
![calendar-3](release/deliverables/demos/calendar/screenshots/edit-add-event-ocation-search.png)
![calendar-4](release/deliverables/demos/calendar/screenshots/edit-add-event-recurrences.png)
![calendar-5](release/deliverables/demos/calendar/screenshots/view-events.png)

### Dashboard
A personalised landing page that greets the logged-in user and surfaces their recent and upcoming meetings at a glance.

![dashboard-1](release/deliverables/demos/dashboard/screenshots/dashboard.png)

### Group Management
Create, edit and delete groups. Users can join or leave public groups and filter the group listing by various criteria.

![groupmanagement-1](release/deliverables/demos/group-management/screenshots/create-group.png)
![groupmanagement-2](release/deliverables/demos/group-management/screenshots/delete-group.png)
![groupmanagement-3](release/deliverables/demos/group-management/screenshots/edit-group.png)
![groupmanagement-4](release/deliverables/demos/group-management/screenshots/join-public-group.png)
![groupmanagement-5](release/deliverables/demos/group-management/screenshots/leave-public-group.png)
![groupmanagement-6](release/deliverables/demos/group-management/screenshots/view-filter-groups.png)

### Poll Management
Browse active polls, cast votes and view results through configurable chart types with built-in analytics.

![poll-1](release/deliverables/demos/poll-management/screenshots/poll-analytics.png)
![poll-2](release/deliverables/demos/poll-management/screenshots/poll-vote.png)
![poll-3](release/deliverables/demos/poll-management/screenshots/preferred-chart-type.png)

### Profile
Displays the current user's profile details (name, title, department, group memberships) and suggests other users within the tenant to connect with.

![profile-1](release/deliverables/demos/profile/screenshots/profile.png)

---

## Repository Structure

| Path | Description |
|------|-------------|
| [release/](release/README.md) | Production-ready source, build config and deployment notes |
| [release/deliverables/](release/deliverables/) | Demo videos and screenshots for each web part |
| [release/src/webparts/](release/src/webparts/) | React components, controls and data models per web part |
| [release/src/services/](release/src/services/) | Service layer handling PnPjs calls and SharePoint list CRUD |
| [release/src/tests/](release/src/tests/) | Jest unit tests covering core component logic |

---

## Deployment

See the full [setup and deployment guide](release/README.md). For additional detail, refer to Microsoft's official walkthrough:
[Serve your web part in a SharePoint page](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page)