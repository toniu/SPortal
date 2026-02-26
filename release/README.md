# SPortal — Setup and Development Guide

## Overview

This project contains five SharePoint Framework (SPFx) web parts that together form a small intranet portal. Each one is a standalone React component backed by SharePoint Lists.

| Web Part | What it does |
|----------|-------------|
| [Dashboard](src/webparts/dashboardApp) | Greets the user and shows their recent and upcoming meetings |
| [Profile](src/webparts/profile) | Displays the current user's profile and suggests other people to connect with |
| [Group Management](src/webparts/groupManagement) | Create, edit, delete, join and leave groups |
| [Poll Management](src/webparts/pollManagement) | Vote on polls and view results with configurable chart types |
| [Calendar](src/webparts/calendar) | Manage events — supports recurrence, location search and permission checks |

## SPFx Version

![version](https://img.shields.io/badge/version-1.16.1-green.svg)

## Compatibility

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

## Prerequisites

- Node.js (LTS)
- PnPjs library
- office-ui-fabric-react
- react-big-calendar
- At least one SharePoint site with the required lists (see individual web part READMEs for specifics)

## Getting Started

1. Clone the repository and navigate to this folder.
2. Install dependencies and build:

```bash
npm install
gulp build
```

3. Start the local workbench:

```bash
gulp serve
```

Or use hot-reload for a faster feedback loop:

```bash
npm run serve
```

## Testing

Unit tests are in [src/tests](src/tests/). Run them with:

```bash
npm test
```

## Deployment

Build a production bundle, then upload the package to your tenant's App Catalogue:

```bash
gulp build
gulp bundle --ship
gulp package-solution --ship
```

This produces a `.sppkg` file. Upload it to your **App Catalogue** and click **Deploy**.

For a step-by-step walkthrough, see Microsoft's guide:
[Serve your web part in a SharePoint page](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page)

### Adapting to a different tenant

The code references a specific tenant email pattern (`zhac...@live.rhul.ac.uk`). To run on your own tenant, search for `zhac` across the codebase and replace it with your tenant's email format. The most notable place is the `_getUsersToDiscover` method in `Profile.tsx`.

> No admin access? You can get a free dev tenant via the [Microsoft 365 Developer Program](http://aka.ms/o365devprogram).

## Contributors

Solution | Author(s)
---------|----------
All Web Parts | [Neka Toni-Uebari](https://github.com/toniu)
Calendar (based on [react-calendar](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)) | Abderahman Moujahid, Eli H. Schei, Hugo Bernier, Joao Mendes, Mohamed Derhalli, Mohammed Amer, Nanddeep Nachan
Poll Management (based on [react-quick-poll](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-quick-poll)) | Sudharsan K., Dipen Shah

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Publish SPFx apps to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp)
- [Deploying web parts](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page)

## Licence

This code is provided as-is without warranty of any kind, express or implied.
