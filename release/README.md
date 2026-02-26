# SPortal — Development Guide

Detailed setup, configuration and deployment instructions for the SPortal web parts. See the [root README](../README.md) for an overview of the project, features and screenshots.

> **Built with:** SPFx 1.16 · TypeScript · React · PnPjs · Office UI Fabric React · Jest · Gulp

---

## Table of Contents

- [Web Parts](#web-parts)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Deployment](#deployment)
- [Tenant Configuration](#tenant-configuration)
- [Contributors](#contributors)
- [References](#references)

---

## Web Parts

| Web Part | Description | README |
|----------|-------------|--------|
| Dashboard | Personalised welcome screen with recent and upcoming meetings | [README](src/webparts/dashboardApp/README.md) |
| Profile | Current user's profile card with suggested connections | [README](src/webparts/profile/README.md) |
| Group Management | Create, edit, delete, join and leave groups | [README](src/webparts/groupManagement/README.md) |
| Poll Management | Vote on polls and view chart-based analytics | [README](src/webparts/pollManagement/README.md) |
| Calendar | Full event lifecycle with recurrence and location search | [README](src/webparts/calendar/README.md) |

### SPFx Version

![version](https://img.shields.io/badge/version-1.16.1-green.svg)

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 LTS)
- npm (bundled with Node.js)
- [SharePoint Framework](https://aka.ms/spfx) development environment
- A [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant) with at least one SharePoint site
- SharePoint Lists configured for each web part (see individual READMEs)

Key dependencies installed via npm:

| Package | Purpose |
|---------|---------|
| `@pnp/sp` | SharePoint REST API wrapper |
| `office-ui-fabric-react` | Microsoft's component library for consistent SP styling |
| `react-big-calendar` | Month/week/day calendar view (used by the Calendar web part) |

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/toniu/SPortal.git
cd SPortal/release

# 2. Install dependencies
npm install

# 3. Build
gulp build

# 4. Start the local workbench
gulp serve
```

For a faster feedback loop during development:

```bash
npm run serve
```

---

## Testing

Unit tests live in [`src/tests/`](src/tests/):

```bash
npm test
```

Tests use **Jest** and cover the core service methods and component logic for each web part.

---

## Deployment

Build a production bundle and package the solution:

```bash
gulp build
gulp bundle --ship
gulp package-solution --ship
```

This produces a `.sppkg` file in `sharepoint/solution/`. Upload it to your tenant's **App Catalogue** and click **Deploy**.

For the full walkthrough, see Microsoft's guide: [Serve your web part in a SharePoint page](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page).

---

## Tenant Configuration

The source code references a specific tenant email pattern (`zhac...@live.rhul.ac.uk`). To deploy to a different tenant:

1. Search the codebase for `zhac`
2. Replace all occurrences with your tenant's email format (e.g. `user@yourdomain.onmicrosoft.com`)
3. The most notable file is `Profile.tsx` — the `_getUsersToDiscover` method filters users by this domain

> No admin access to a SharePoint tenant? Get a free dev tenant via the [Microsoft 365 Developer Program](http://aka.ms/o365devprogram).

---

## Contributors

| Solution | Author(s) |
|----------|-----------|
| All Web Parts | [Neka Toni-Uebari](https://github.com/toniu) |
| Calendar (based on [react-calendar](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)) | Abderahman Moujahid, Eli H. Schei, Hugo Bernier, Joao Mendes, Mohamed Derhalli, Mohammed Amer, Nanddeep Nachan |
| Poll Management (based on [react-quick-poll](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-quick-poll)) | Sudharsan K., Dipen Shah |

---

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Publish SPFx apps to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp)
- [Deploying web parts](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page)

---

## Licence

This code is provided as-is without warranty of any kind, express or implied.
