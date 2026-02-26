# Calendar Web Part

A full-featured event calendar for SharePoint Online. Users select a SharePoint Events list through the property pane, then browse, create, edit and delete events. The web part checks the current user's list permissions before allowing changes, and supports recurring events and location search.

> **Built with:** SPFx · React · PnPjs · Office UI Fabric React · react-big-calendar

---

## Features

- **Configurable Data Source** — Pick any Events-type list on the site via the property pane
- **Multiple Views** — Switch between month, week and day layouts
- **Event CRUD** — Add and edit events with attendee selection, all-day toggles, recurrence rules and map-based location search
- **Permission Gating** — Delete and edit buttons only appear when the user has the required list permissions

---

## Configuration Properties

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| Site URL of Calendar List | Text | Yes | URL of the site containing the Events list |
| Calendar list | Dropdown | Yes | Auto-populated with all Events-type lists on the site |
| Start Date | Date | Yes | Earliest date to retrieve events from |
| End Date | Date | Yes | Latest date to retrieve events until |

---

## Author

**[Neka Toni-Uebari](https://github.com/toniu)**

### Acknowledgements

Calendar functionality builds on the [react-calendar](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar) community sample by Abderahman Moujahid, Eli H. Schei, Hugo Bernier, Joao Mendes, Mohamed Derhalli, Mohammed Amer and Nanddeep Nachan.
