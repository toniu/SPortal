# Poll Management Web Part

An interactive polling system where administrators define questions, choices and date ranges through the property pane, and end users cast votes and view live results via configurable charts.

> **Built with:** SPFx · React · PnPjs · Office UI Fabric React

---

## Features

- **One-Click Voting** — Submit a vote on any active poll
- **Chart Analytics** — View aggregated results as bar, pie or doughnut charts (configurable per poll)
- **Date-Driven Visibility** — Polls appear and expire automatically based on start and end dates
- **Customisable Copy** — Override the success message, response message and submit-button text from the property pane

---

## Configuration Properties

| Property | Type | Notes |
|----------|------|-------|
| Display poll based on date | Toggle | Uses Start Date / End Date to control poll visibility |
| Poll Questions | Collection | Title, comma-separated choices, active flag and optional date range per entry |
| Success Message | Text | Shown after submission (default: "Thank you for your submission") |
| Response Message | Text | Shown with the user's choice (default: "You voted for: ~User Response~") |
| Submit button text | Text | Label on the vote button (default: "Submit Vote") |
| Preferred Chart Type | Dropdown | Chart style for displaying results |

---

## Author

**[Neka Toni-Uebari](https://github.com/toniu)**

### Acknowledgements

Poll functionality builds on the [react-quick-poll](https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-quick-poll) community sample by Sudharsan K. and Dipen Shah.

