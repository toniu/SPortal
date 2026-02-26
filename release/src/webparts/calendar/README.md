# Calendar Web Part

## What it does

A full-featured event calendar for SharePoint. Users pick a SharePoint Events list through the property pane, then they can browse, create, edit and delete events. The web part checks the current user's permissions before allowing changes, and supports recurring events and location search out of the box.

## Key features

- Configure which Events list to use
- Multiple calendar views (month, week, day)
- Add and edit events with attendees, all-day flags, recurrence rules and location search
- Delete events (with permission checks)

## Configuration properties

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| Site URL of Calendar List | Text | Yes | URL of the site containing the list |
| Calendar list | Dropdown | Yes | Populated with all Events-type lists on the site |
| Start Date | Date | Yes | Earliest date to retrieve events from |
| End Date | Date | Yes | Latest date to retrieve events until |

## Built with

- SPFx, React, PnPjs, Office UI Fabric React, react-big-calendar

## Author

[Neka Toni-Uebari](https://github.com/toniu)

Calendar functionality draws on the open-source [react-calendar](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar) sample by Abderahman Moujahid, Eli H. Schei, Hugo Bernier, Joao Mendes, Mohamed Derhalli, Mohammed Amer and Nanddeep Nachan.
