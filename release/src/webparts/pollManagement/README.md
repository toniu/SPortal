### Poll management web part

## Summary
This component is developed for the configuration and management of polls. It requires a SharePoint list 'Polls'.

# Demo
- [Demo videos](/final/demos/poll-management/)

## Features of this component:
- Submit votes - submit a vote into a poll
- Configure polls - display polls based on date; CRUD operations of polls
- Configure chart type - for displaying poll results

## Web Part properties
1. **Display poll based on date** - This property will check for the **Start Date** and **End Date** on the poll questions to display the correct poll question to the end user. The **Start Date** and **End Date** on the poll question will be enabled only when this property is turned on.
2. **Poll Questions** - Manage the collection of poll questions and choices.
    * **Question Title** - Title of the question.
    * **Choices** - Choices separated by comma.
    * **Active** - Whether the poll is active or not
    * **Start Date** - Date when the end user can start seeing the poll question.
    * **End Date** - Last day of the poll question visible to the end user.
3. **Success Message** - Message to be displayed to the user after a successful submission. It is optional, if not provided the default message '**Thank you for your submission**' will be displayed.
4. **Response Message** - Message to be displayed to the user with the user response, once the user has submitted. It is optional, if not provided the default message '**You voted for: ~User Response~**' will be displayed below the chart.
5. **Submit button text** - Text to be displayed on the submit button. It is optional, if not provided the default text '**Submit Vote**' will be displayed.
6. **Preferred Chart Type** - Chart type to display the overall response for the question.

## Applies to
- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

## Prerequisites
SharePoint Lists

## Solution and Contributors
The Web Part Use PnPjs library, Office-ui-fabric-react components.

Solution|Author(s)
--------|---------
Poll Management Web Part|[Neka Toni-Uebari](https://gitlab.cim.rhul.ac.uk/zhac032)
From (react-quick-poll: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-quick-poll) | [Sudharsan K.](https://github.com/sudharsank) ([@sudharsank](https://twitter.com/sudharsank), [Know More](https://spknowledge.com/))
From (react-quick-poll: https://github.com/pnp/sp-dev-fx-webparts/tree/main/samples/react-quick-poll) | [Dipen Shah](https://github.com/dips365) ([@Dips_365](https://twitter.com/Dips_365))

