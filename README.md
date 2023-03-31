A repository containing

- deliverables: Folder of final report and demo videos and screenshots of web parts
    - [Deliverables](/deliverables/README.md)
    - [PDF]

- release: The web part repository
    - [Code Repository](/release/README.md)
    - [Webparts](/release/src/webparts/): the web parts of the project: includes React components, controls and models
    - [Services](/release/src/services): the services required for PnP and SP list CRUD operations
    - [Tests](/release/src/tests/): the unit tests of the key methods of the web part components in an isolated TDD environment

NOTE: The team was unable to deploy web parts into SharePoint site due to having no administration access into the RHUL SharePoint administration centre. There are [deployment steps](/release/README.md) to follow the packaging and uploading of the web parts into the website as an admin of a RHUL SharePoint site. If these steps are not sufficient, then please follow Microsoft's suggested steps:
(https://learn.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/serve-your-web-part-in-a-sharepoint-page)