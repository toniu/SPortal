### Dashboard web part

## Summary
This component is developed to welcome the user and display the recent and upcoming events based on the SharePoint events list selected.

# Demo
- [Demo videos](/final/demos/dashboard/)

## Features of this component:
- Configure the event list that will be used
- Displays the recent and upcoming events 

## Web Part properties
Property |Type|Required| comments
--------------------|----|--------|----------
Site Url of Calendar List | Text| yes|
Calendar list| Choice/Dropdown | yes|  this is filled with all list of  type "event list" created
Start Date | Date | yes | Event Date
End Date| Date| yes | Event Date

## Applies to
- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

## Prerequisites
SharePoint Lists

## Solution and Contributors
The Web Part Use PnPjs library, Office-ui-fabric-react components.

Solution|Author(s)
--------|---------
Dashboard App Web Part|[Neka Toni-Uebari](https://gitlab.cim.rhul.ac.uk/zhac032)