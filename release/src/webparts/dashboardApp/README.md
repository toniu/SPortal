# Dashboard Web Part

A personalised landing page that welcomes the logged-in user by name and surfaces their recent and upcoming calendar events. The data source is a SharePoint Events list configured by the site owner through the property pane.

> **Built with:** SPFx · React · PnPjs · Office UI Fabric React

---

## Features

- **Personalised Greeting** — Displays the current user's name on load
- **Meeting Summary** — Shows past and upcoming events pulled from a configurable Events list
- **Property Pane Config** — Site owners choose which list and date range to use without editing code

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
