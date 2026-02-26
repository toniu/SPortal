# Dashboard Web Part

## What it does

Welcomes the logged-in user and shows their recent and upcoming calendar events. The events are pulled from a SharePoint Events list that the site owner configures through the web part property pane.

## Key features

- Configurable event list — pick any Events-type list on the site
- Shows past and future meetings in a clean summary view

## Configuration properties

| Property | Type | Required | Notes |
|----------|------|----------|-------|
| Site URL of Calendar List | Text | Yes | URL of the site containing the list |
| Calendar list | Dropdown | Yes | Populated with all Events-type lists on the site |
| Start Date | Date | Yes | Earliest date to retrieve events from |
| End Date | Date | Yes | Latest date to retrieve events until |

## Built with

- SPFx, React, PnPjs, Office UI Fabric React

## Author

[Neka Toni-Uebari](https://github.com/toniu)
