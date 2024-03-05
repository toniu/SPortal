A SPFx React TypeScript project which includes a set of web parts designed for a particular Sharepoint website regarding the management of users, groups and informational within a Sharepoint portal.

Technology stack: SPFx framework, TypeScript, React, Jest, Gulp, SharePoint Lists
## The features of the project include...

**Calendar web part:** The management of events of the calendar. This includes the configuration, viewing, adding, editing and deleting events, including search for the location on the maps. There is also a special feature to handle recurrences of events too.
![calendar-1](release/deliverables/demos/calendar/screenshots/add-edit-event.png)
![calendar-2](release/deliverables/demos/calendar/screenshots/delete-event.png)
![calendar-3](release/deliverables/demos/calendar/screenshots/edit-add-event-ocation-search.png)
![calendar-4](release/deliverables/demos/calendar/screenshots/edit-add-event-recurrences.png)
![calendar-5](release/deliverables/demos/calendar/screenshots/view-events.png)

**Dashboard web part:** The dashboard for the login user which welcomes them and presents the past and upcoming meetings.
![dashboard-1](release/deliverables/demos/dashboard/screenshots/dashboard.png)

**Group Management web part:** The management of groups which includes creating, editing, deleting groups, joining and leaving public groups as well as filtering groups viewed.
![groupmanagement-1](release/deliverables/demos/group-management/screenshots/create-group.png)
![groupmanagement-2](release/deliverables/demos/group-management/screenshots/delete-group.png)
![groupmanagement-3](release/deliverables/demos/group-management/screenshots/edit-group.png)
![groupmanagement-4](release/deliverables/demos/group-management/screenshots/join-public-group.png)
![groupmanagement-5](release/deliverables/demos/group-management/screenshots/leave-public-group.png)
![groupmanagement-6](release/deliverables/demos/group-management/screenshots/view-filter-groups.png)

**Poll Management web part:** The management of polls which includes viewing poll analytics, voting for polls and configuration of the chart type to display.
![poll-1](release/deliverables/demos/poll-management/screenshots/poll-analytics.png)
![poll-2](release/deliverables/demos/poll-management/screenshots/poll-vote.png)
![poll-3](release/deliverables/demos/poll-management/screenshots/preferred-chart-type.png)

**Profile web part:** The profile to display the details of the logged user. This also includes a feature to view suggested users based on the current user.
![profile-1](release/deliverables/demos/profile/screenshots/profile.png)

Technology stack: SPFx framework, TypeScript, React, Jest, Gulp, SharePoint Lists

The repository contains
- release: The final release of code for the web part repository
    - [Code Repository](/release/README.md)
    - [Deliverables](/release/deliverables): the deliverables (GIFs of demos)
        - [Demos](/release/deliverables/demos/): includes the demos for the web parts (videos and screenshots)
    - [Webparts](/release/src/webparts/): the web parts of the project: includes React components, controls and models
    - [Services](/release/src/services): the services required for PnP and SP list CRUD operations
    - [Tests](/release/src/tests/): the unit tests of the key methods of the web part components in an isolated TDD environment

There are [deployment steps](/release/README.md) to follow the packaging and uploading of the web parts into the website as an admin of a RHUL SharePoint site. If these steps are not sufficient, then please follow Microsoft's suggested steps:
(https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page)
