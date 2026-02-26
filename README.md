# SPortal — SharePoint Intranet Portal

A suite of five SharePoint Framework web parts that form a self-contained intranet portal. Users can manage their profile, browse and join groups, participate in polls, track calendar events, and view a personalised dashboard — all within SharePoint Online.

> **Built with:** SPFx 1.16 · TypeScript · React · PnPjs · Office UI Fabric React · Jest · Gulp · SharePoint Lists

### [View Live Demo](https://toniu.github.io/SPortal/)

---

## Table of Contents

- [Features](#features)
- [Tech Stack and Key Decisions](#tech-stack-and-key-decisions)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [Author](#author)

---

## Features

### Calendar
- **Event Management** — Create, edit and delete events with attendee selection, all-day toggles and location search via maps
- **Recurring Events** — Define daily, weekly or monthly recurrence rules when adding or editing an event
- **Multiple Views** — Switch between month, week and day views in react-big-calendar
- **Permission Checks** — CRUD operations are gated by the current user's SharePoint permissions on the Events list

### Dashboard
- **Personalised Welcome** — Greets the logged-in user by name
- **Meeting Summary** — Pulls recent and upcoming events from a configurable SharePoint Events list

### Group Management
- **Group CRUD** — Create, rename and delete groups you own
- **Membership** — Join or leave public groups; owners can add or remove members
- **Filter and Search** — Browse all groups with name and type filters
- **Three-List Data Model** — Backed by `Groups`, `GroupOwners` and `GroupMembers` SharePoint Lists

### Poll Management
- **Voting** — Cast a vote on active polls with a single click
- **Analytics** — View aggregated results as bar, pie or doughnut charts (configurable)
- **Date-Driven Visibility** — Polls appear and expire automatically based on start/end dates
- **Customisable Copy** — Override the success message, response message and submit-button text

### Profile
- **User Card** — Displays the current user's name, job title, department and group memberships
- **People You Might Know** — Suggests other users within the tenant based on a randomised selection

---

## Tech Stack and Key Decisions

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | SPFx 1.16 | Microsoft's official model for building SharePoint client-side solutions |
| **UI Library** | React 16 | Component-based rendering with lifecycle hooks and state management |
| **Language** | TypeScript | Static typing catches errors at compile time across all web parts |
| **SharePoint API** | PnPjs | Fluent, promise-based wrapper around SharePoint REST and Graph APIs |
| **Component Library** | Office UI Fabric React | Consistent look and feel with the rest of the SharePoint UI |
| **Calendar** | react-big-calendar | Proven month/week/day calendar component with event drag-and-drop |
| **Testing** | Jest | Unit tests for service methods and component logic in isolation |
| **Build** | Gulp + Webpack | SPFx toolchain — bundle, package and deploy `.sppkg` solutions |

### Notable Design Patterns

- **Service Layer** — All SharePoint list operations go through dedicated service classes (`UserEventService`, `UserGroupService`, `UserPollService`, `UserProfileService`) that implement `IDataService`, keeping components free of data-access logic
- **PnPjs Configuration Singleton** — `pnpjsConfig.ts` initialises the PnP SP context once and shares it across all services
- **Property Pane Configuration** — Each web part exposes its data source (list URL, list name, date range) through the SPFx property pane so site owners can configure without editing code

---

## Screenshots

### Calendar
| Add / Edit Event | Delete Event | Location Search |
|------------------|--------------|-----------------|
| ![Add/Edit](release/deliverables/demos/calendar/screenshots/add-edit-event.png) | ![Delete](release/deliverables/demos/calendar/screenshots/delete-event.png) | ![Location](release/deliverables/demos/calendar/screenshots/edit-add-event-ocation-search.png) |

| Recurrences | View Events |
|-------------|-------------|
| ![Recurrences](release/deliverables/demos/calendar/screenshots/edit-add-event-recurrences.png) | ![View](release/deliverables/demos/calendar/screenshots/view-events.png) |

### Dashboard
| Dashboard |
|-----------|
| ![Dashboard](release/deliverables/demos/dashboard/screenshots/dashboard.png) |

### Group Management
| Create Group | Edit Group | Delete Group |
|--------------|------------|--------------|
| ![Create](release/deliverables/demos/group-management/screenshots/create-group.png) | ![Edit](release/deliverables/demos/group-management/screenshots/edit-group.png) | ![Delete](release/deliverables/demos/group-management/screenshots/delete-group.png) |

| Join Group | Leave Group | Filter Groups |
|------------|-------------|---------------|
| ![Join](release/deliverables/demos/group-management/screenshots/join-public-group.png) | ![Leave](release/deliverables/demos/group-management/screenshots/leave-public-group.png) | ![Filter](release/deliverables/demos/group-management/screenshots/view-filter-groups.png) |

### Poll Management
| Poll Analytics | Vote | Chart Type |
|----------------|------|------------|
| ![Analytics](release/deliverables/demos/poll-management/screenshots/poll-analytics.png) | ![Vote](release/deliverables/demos/poll-management/screenshots/poll-vote.png) | ![Chart](release/deliverables/demos/poll-management/screenshots/preferred-chart-type.png) |

### Profile
| Profile |
|---------|
| ![Profile](release/deliverables/demos/profile/screenshots/profile.png) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 LTS)
- npm (bundled with Node.js)
- A SharePoint Online tenant (or a [free dev tenant](http://aka.ms/o365devprogram))

### Installation

```bash
# Clone the repository
git clone https://github.com/toniu/SPortal.git
cd SPortal/release

# Install dependencies
npm install

# Build
gulp build
```

### Running Locally

```bash
# Start the SharePoint workbench
gulp serve

# Or use hot-reload for faster iteration
npm run serve
```

---

## Project Structure

```
release/
├── src/
│   ├── index.ts                        # Package entry point
│   ├── pnpjsConfig.ts                  # PnPjs SP context initialisation
│   ├── common/
│   │   └── enumHelper.ts               # Shared enum utilities
│   ├── services/
│   │   ├── IDataService.ts             # Service interface
│   │   ├── UserEventService.ts         # Calendar event CRUD
│   │   ├── UserGroupService.ts         # Group membership CRUD
│   │   ├── UserPollService.ts          # Poll voting and results
│   │   └── UserProfileService.ts       # Profile and user discovery
│   ├── tests/
│   │   ├── DashboardApp.test.tsx       # Dashboard unit tests
│   │   ├── GroupManagement.test.tsx     # Group management unit tests
│   │   ├── PollManagement.test.tsx      # Poll management unit tests
│   │   └── Profile.test.tsx            # Profile unit tests
│   └── webparts/
│       ├── calendar/                   # Calendar web part
│       │   ├── CalendarWebPart.ts      # Web part entry, property pane config
│       │   ├── components/             # React components (Calendar, EventPanel, etc.)
│       │   ├── controls/              # Reusable controls (DateTimePicker, MapPicker)
│       │   ├── models/                # TypeScript interfaces and enums
│       │   └── utils/                 # Helper functions
│       ├── dashboardApp/              # Dashboard web part
│       ├── groupManagement/           # Group management web part
│       ├── pollManagement/            # Poll management web part
│       └── profile/                   # Profile web part
├── config/                            # SPFx build configuration
├── deliverables/                      # Demo videos and screenshots
├── fast-serve/                        # SPFx fast-serve hot-reload config
├── sharepoint/solution/               # Packaged .sppkg solution
└── teams/                             # Teams manifest (if applicable)
```

---

## Testing

```bash
cd release
npm test
```

Tests use **Jest** and cover the core methods of each web part's component logic in isolation.

---

## Deployment

Build, bundle and package the solution, then upload to your App Catalogue:

```bash
gulp build
gulp bundle --ship
gulp package-solution --ship
```

Upload the resulting `.sppkg` from `sharepoint/solution/` to your tenant's **App Catalogue** and deploy.

For the full walkthrough, see Microsoft's guide: [Serve your web part in a SharePoint page](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page).

---

## Author

**Neka Toni-Uebari**

- GitHub: [toniu](https://github.com/toniu)

### Acknowledgements

The Calendar web part builds on the [react-calendar](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar) community sample. The Poll Management web part builds on the [react-quick-poll](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-quick-poll) community sample.