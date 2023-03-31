# Final Project Solution

## Summary
The following repository offers the following [webparts](spfx-react/src/webparts):
- [Dashboard](/spfx-react/src/webparts/dashboardApp)
- [Profile](/spfx-react/src/webparts/profile)
- [Group management](/spfx-react/src/webparts/groupManagement)
- [Poll management](/spfx-react/src/webparts/pollManagement)
- [Calendar](/spfx-react/src/webparts/calendar)

## Used SharePoint Framework Version
![version](https://img.shields.io/badge/version-1.16.1-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

## Prerequisites
The web parts use:
- PnPjs library
- office-ui-fabric-react components
- react big-calendar component
- SharePoint Lists

## Installation and usage
- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp build**

- To run the SharePoint server:
  - **gulp serve**
- OR to run as hot-reload:
  -**npm run serve**

## Testing
The unit tests can be found under:
[tests](/spfx-react/src/tests)

- To run unit tests:
  - **npm test**

## Deployment steps
> As a developer with administration access to a RHUL SharePoint site:
The steps are based on Microsoft (further details of steps can be found here: https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page)

The deployment for the web part depends on the developer’s access into the administration centre of RHUL SharePoint. However, the team did not have access into the administration centre. This would have been the steps to follow if given the administration access:

  - `gulp build`
  - `gulp bundle --ship`
  - `gulp package-solution --ship`
  - Add to **AppCatalog** and deploy

Final note on deployment:
> If as a developer you are unable to gain administration access into the RHUL SharePoint admin centre then you can get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)
- The main changes would include the change of the email associated with the tenant e.g. for RHUL it is 'zhac'.

Any occurence of 'zhac' and '...@live.rhul.ac.uk' in the code for the web parts would need to be changed to your respective tenant; for example your tenant has the email in the form of userXXX@live.[tenant-url].
The main suggestion is to CTRL + F 'zhac' for any component of the web part: 
i.e. there is a component, Profile.tsx (/spfx-react/src/webparts/profile/components/Profile.tsx), which has a method, _getUsersToDiscover:
The occurences of 'zhac' to extract and randomise new users would have to modified to the email template of your personal tenant


## Solution and Contributors
The Web Parts Use PnPjs library, Office-ui-fabric-react components, react Big-Calendar Component
Solution|Author(s)
--------|---------
All Web Parts|[Neka Toni-Uebari](https://gitlab.cim.rhul.ac.uk/zhac032)
(From react-calendar: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)|[Abderahman Moujahid](https://github.com/Abderahman88)
(From react-calendar: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)|[Eli H. Schei](https://github.com/Eli-Schei)
(From react-calendar: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)|[Hugo Bernier](https://github.com/hugoabernier) ([@bernier](https://twitter.com/bernierh), [Tahoe Ninjas](https://tahoeninjas.blog/))
(From react-calendar: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)|[João Mendes](https://github.com/joaojmendes)
(From react-calendar: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)|[Mohamed Derhalli](https://github.com/derhallim)
(From react-calendar: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)|[Mohammed Amer](https://github.com/mohammadamer) ([@Mohammad3mer](https://twitter.com/Mohammad3mer), https://www.linkedin.com/in/mohammad3mer/)
(From react-calendar: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-calendar)|[Nanddeep Nachan](https://github.com/nanddeepn) ([@NanddeepNachan](https://twitter.com/NanddeepNachan))
From (react-quick-poll: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-quick-poll) | [Sudharsan K.](https://github.com/sudharsank) ([@sudharsank](https://twitter.com/sudharsank), [Know More](https://spknowledge.com/))
From (react-quick-poll: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-quick-poll) | [Dipen Shah](https://github.com/dips365) ([@Dips_365](https://twitter.com/Dips_365))

## References
- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
-[Deployment of webparts](https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page)

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---