### Calendar web part

## Summary
This component is developed for the configuration and management of events in a calendar. It uses a SharePoint Events list configured by the user to retrieve and manage events with. The web part also checks for user permissions of the CRUD operations for the events.

# Demo
- [Demo for this web part](/final/demos/calendar/)

## Features of this component:
- Configure events list
- Select view of calendar and view events
- Edit/Add events (including setting atendees, all-day, recurrence, location search)
- Delete events

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
The Web Part Use PnPjs library, Office-ui-fabric-react components. react Big-Calendar Component

Solution|Author(s)
--------|---------
Calendar Web Part|[Neka Toni-Uebari](https://gitlab.cim.rhul.ac.uk/zhac032)
(From react-calendar: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)|[Abderahman Moujahid](https://github.com/Abderahman88)
(From react-calendar: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)|[Eli H. Schei](https://github.com/Eli-Schei)
(From react-calendar: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)|[Hugo Bernier](https://github.com/hugoabernier) ([@bernier](https://twitter.com/bernierh), [Tahoe Ninjas](https://tahoeninjas.blog/))
(From react-calendar: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)|[João Mendes](https://github.com/joaojmendes)
(From react-calendar: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)|[Mohamed Derhalli](https://github.com/derhallim)
(From react-calendar: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)|[Mohammed Amer](https://github.com/mohammadamer) ([@Mohammad3mer](https://twitter.com/Mohammad3mer), https://www.linkedin.com/in/mohammad3mer/)
(From react-calendar: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)|[Nanddeep Nachan](https://github.com/nanddeepn) ([@NanddeepNachan](https://twitter.com/NanddeepNachan))

