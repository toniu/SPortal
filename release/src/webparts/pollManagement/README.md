# Poll Management Web Part

## What it does

Lets site users participate in polls and view the results through configurable charts. Administrators define poll questions, choices and date ranges in the property pane; end users cast votes and see live analytics.

## Key features

- Submit votes on active polls
- View poll results as bar, pie or doughnut charts (configurable)
- Date-driven display — polls appear and expire automatically based on start/end dates
- Customisable success, response and button text

## Configuration properties

| Property | Type | Notes |
|----------|------|-------|
| Display poll based on date | Toggle | When on, uses Start Date / End Date to control visibility |
| Poll Questions | Collection | Each entry has a title, comma-separated choices, active flag and optional date range |
| Success Message | Text | Shown after a vote is submitted (default: "Thank you for your submission") |
| Response Message | Text | Shown with the user's choice (default: "You voted for: ~User Response~") |
| Submit button text | Text | Label on the vote button (default: "Submit Vote") |
| Preferred Chart Type | Dropdown | Chart style for displaying results |

## Built with

- SPFx, React, PnPjs, Office UI Fabric React

## Author

[Neka Toni-Uebari](https://github.com/toniu)

Poll functionality draws on the open-source [react-quick-poll](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-quick-poll) sample by Sudharsan K. and Dipen Shah.

