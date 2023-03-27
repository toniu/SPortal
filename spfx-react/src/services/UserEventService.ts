/* eslint-disable @rushstack/security/no-unsafe-regexp */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* SP/PNP imports */
import "@pnp/sp/webs"
import "@pnp/sp/lists"
import "@pnp/sp/fields"
import "@pnp/sp/profiles"
import "@pnp/sp/security";
import "@pnp/sp/site-users/web"
import "@pnp/sp/regional-settings/web"
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { PermissionKind } from "@pnp/sp/security";
import { SPFI } from '@pnp/sp';
import { getSP } from '../pnpjsConfig';

import '@pnp/sp';
import '@pnp/queryable';
import * as $ from 'jquery';
import { IEventData } from '../webparts/calendar/models/IEventData';
import * as moment from 'moment';
import { IUserPermissions } from '../webparts/calendar/models/IUserPermissions';
import parseRecurrentEvent from '../webparts/calendar/models/parseRecurrentEvent';

/**
 * Web part service for handling events
 */
export class UserEventService {
    private static instance: UserEventService
    private _sp: SPFI;

    /**
     * The set-up of the SharePoint context
     * @param context The web part context
     */
    public setup(context: WebPartContext): void {
        this._sp = getSP(context);
        console.log(this._sp)
    }

    /**
     * Singleton instance
     * @returns the instance
     */
    static getInstance(): UserEventService {
        if (!UserEventService.instance) {
            UserEventService.instance = new UserEventService();
        }
        return UserEventService.instance
    }

    /**
     * Get the local time based on regional settings
     * @param date The date string
     * @returns the local time
     */
    public async getLocalTime(date: string | Date): Promise<string> {
        try {
            const localTime = await this._sp.web.regionalSettings.timeZone.utcToLocalTime(date);
            return localTime;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Get the time zone
     * @param date the date string
     * @returns the time based on time zone
     */
    public async getUtcTime(date: string | Date): Promise<any> {
        try {
            const utcTime = await this._sp.web.regionalSettings.timeZone.localTimeToUTC(date);
            return utcTime;
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Adding a new event to calendar
     * @param newEvent The data of the new event to add
     * @param siteUrl the site URL
     * @param listId the ID of the SP list
     * @returns The result from adding SP list
     */
    public async addEvent(newEvent: IEventData, siteUrl: string, listId: string): Promise<any> {
        let results = null;
        try {
            console.log('Adding event to list...', await this._sp.web.lists.getById(listId).items)
            results = await this._sp.web.lists.getById(listId).items.add({
                Title: newEvent.title,
                Description: newEvent.Description,
                Geolocation: newEvent.geolocation,
                ParticipantsPickerId: { results: newEvent.attendes },
                EventDate: await this.getUtcTime(newEvent.EventDate),
                EndDate: await this.getUtcTime(newEvent.EndDate),
                Location: newEvent.location,
                fAllDayEvent: newEvent.fAllDayEvent,
                fRecurrence: newEvent.fRecurrence,
                Category: newEvent.Category,
                EventType: newEvent.EventType,
                UID: newEvent.UID,
                RecurrenceData: newEvent.RecurrenceData ? await this.deCodeHtmlEntities(newEvent.RecurrenceData) : "",
                MasterSeriesItemID: newEvent.MasterSeriesItemID,
                RecurrenceID: newEvent.RecurrenceID ? newEvent.RecurrenceID : undefined,
            });
        }
        catch (error) {
            return Promise.reject(error);
        }
        return results;
    }

    /**
     * Get selected event from calendar
     * @param siteUrl the site URL
     * @param listId the ID of the SP list
     * @param eventId the ID of the event
     * @returns the result from getting the event
     */
    public async getEvent(siteUrl: string, listId: string, eventId: number): Promise<IEventData> {
        let returnEvent: IEventData = undefined;
        try {

            //"Title","fRecurrence", "fAllDayEvent","EventDate", "EndDate", "Description","ID", "Location","Geolocation","ParticipantsPickerId"
            // const event = await this._sp.web.lists.getById(listId).items.usingCaching().getById(eventId)
            const event = await this._sp.web.lists.getById(listId).items.getById(eventId)
                .select("RecurrenceID", "MasterSeriesItemID", "Id", "ID", "ParticipantsPickerId", "EventType", "Title", "Description", "EventDate", "EndDate", "Location", "Author/SipAddress", "Author/Title", "Geolocation", "fAllDayEvent", "fRecurrence", "RecurrenceData", "RecurrenceData", "Duration", "Category", "UID")
                .expand("Author")
                ();

            const eventDate = await this.getLocalTime(event.EventDate);
            const endDate = await this.getLocalTime(event.EndDate);

            returnEvent = {
                Id: event.ID,
                ID: event.ID,
                EventType: event.EventType,
                title: await this.deCodeHtmlEntities(event.Title),
                Description: event.Description ? event.Description : '',
                EventDate: new Date(eventDate),
                EndDate: new Date(endDate),
                location: event.Location,
                ownerEmail: event.Author.SipAddress,
                ownerPhoto: "",
                ownerInitial: '',
                color: '',
                ownerName: event.Author.Title,
                attendes: event.ParticipantsPickerId,
                fAllDayEvent: event.fAllDayEvent,
                geolocation: { Longitude: event.Geolocation ? event.Geolocation.Longitude : 0, Latitude: event.Geolocation ? event.Geolocation.Latitude : 0 },
                Category: event.Category,
                Duration: event.Duration,
                UID: event.UID,
                RecurrenceData: event.RecurrenceData ? await this.deCodeHtmlEntities(event.RecurrenceData) : "",
                fRecurrence: event.fRecurrence,
                RecurrenceID: event.RecurrenceID,
                MasterSeriesItemID: event.MasterSeriesItemID,
            };
        }
        catch (error) {
            return Promise.reject(error);
        }
        return returnEvent;
    }

    /**
     * Updating an event in the calendar
     * @param updateEvent the data of the event to edit
     * @param siteUrl the site URL
     * @param listId the ID of the SP list
     * @returns the result from updating the event
     */
    public async updateEvent(updateEvent: IEventData, siteUrl: string, listId: string): Promise<any> {
        let results = null;
        try {
            // delete all recursive extentions before update recurrence event
            if (updateEvent.EventType.toString() === "1") await this.deleteRecurrenceExceptions(updateEvent, siteUrl, listId);

            const eventDate = await this.getUtcTime(updateEvent.EventDate);
            const endDate = await this.getUtcTime(updateEvent.EndDate);

            //"Title","fRecurrence", "fAllDayEvent","EventDate", "EndDate", "Description","ID", "Location","Geolocation","ParticipantsPickerId"
            const newItem: any = {
                Title: updateEvent.title,
                Description: updateEvent.Description,
                Geolocation: updateEvent.geolocation,
                ParticipantsPickerId: { results: updateEvent.attendes },
                EventDate: new Date(eventDate),
                EndDate: new Date(endDate),
                Location: updateEvent.location,
                fAllDayEvent: updateEvent.fAllDayEvent,
                fRecurrence: updateEvent.fRecurrence,
                Category: updateEvent.Category,
                RecurrenceData: updateEvent.RecurrenceData ? await this.deCodeHtmlEntities(updateEvent.RecurrenceData) : "",
                EventType: updateEvent.EventType,
            };

            if (updateEvent.UID) {
                newItem.UID = updateEvent.UID;
            }
            if (updateEvent.MasterSeriesItemID) {
                newItem.MasterSeriesItemID = updateEvent.MasterSeriesItemID;
            }

            results = await this._sp.web.lists.getById(listId).items.getById(updateEvent.Id).update(newItem);
        }
        catch (error) {
            return Promise.reject(error);
        }
        return results;
    }

    /**
     * Deleting recurrence exceptions
     * @param event the data of the selected event
     * @param siteUrl the URL of the site
     * @param listId the ID of the list
     * @returns the result from the operation
     */
    public async deleteRecurrenceExceptions(event: IEventData, siteUrl: string, listId: string): Promise<any> {
        let results = null;
        try {
            results = await this._sp.web.lists.getById(listId).items
                .select('Id')
                .filter(`EventType eq '3' or EventType eq '4' and MasterSeriesItemID eq '${event.Id}' `)
                ();
            if (results && results.length > 0) {
                for (const recurrenceException of results) {
                    await this._sp.web.lists.getById(listId).items.getById(recurrenceException.Id).delete();
                }
            }
        } catch (error) {
            return Promise.reject(error);
        }
        return;
    }

    /**
     * Deleting an event
     * @param event the event 
     * @param siteUrl the URL of the site
     * @param listId the ID of the list
     * @param recurrenceSeriesEdited is the recurrence series edited?
     * @returns 
     */
    public async deleteEvent(event: IEventData, siteUrl: string, listId: string, recurrenceSeriesEdited: boolean): Promise<any> {
        let results = null;
        try {
            // Exception Recurrence eventtype = 4 ?  update to deleted Recurrence eventtype=3
            switch (event.EventType.toString()) {
                case '4': // Exception Recurrence Event
                    results = await this._sp.web.lists.getById(listId).items.getById(event.Id).update({
                        Title: `Deleted: ${event.title}`,
                        EventType: '3',
                    });
                    console.log(results)
                    break;
                case '1': // recurrence Event
                    // if  delete is a main recrrence delete all recurrences and main recurrence
                    if (recurrenceSeriesEdited) {
                        // delete execptions if exists before delete recurrence event
                        await this.deleteRecurrenceExceptions(event, siteUrl, listId);
                        await this._sp.web.lists.getById(listId).items.getById(event.Id).delete();
                    } else {
                        //Applying the Standard funactionality of SharePoint When deleting for deleting one occurrence of recurrent event by
                        // 1) adding prefix "Deleted" to event title  2) Set RecurrenceID to event Date 3) Set MasterSeriesItemID to event ID 4)Set fRecurrence to true 5) Set event type to 3
                        event.title = `Deleted: ${event.title}`;
                        event.RecurrenceID = event.EventDate;
                        event.MasterSeriesItemID = event.ID.toString();
                        event.fRecurrence = true;
                        event.EventType = '3';
                        await this.addEvent(event, siteUrl, listId);
                    }

                    break;
                case '0': // normal Event
                    await this._sp.web.lists.getById(listId).items.getById(event.Id).delete();
                    break;
            }

        } catch (error) {
            return Promise.reject(error);
        }
        return;
    }

    /**
     * Getting the user by ID
     * @param userId The ID of the user
     * @param siteUrl the URL of the site
     * @returns the retrieved results
     */
    public async getUserById(userId: number, siteUrl: string): Promise<any> {
        let results: any = null;

        if (!userId && !siteUrl) {
            return null;
        }

        try {
            results = await this._sp.web.siteUsers.getById(userId)();
        } catch (error) {
            return Promise.reject(error);
        }
        return results;
    }

    /**
     * Getting the user by login name
     * @param loginName the login name
     * @param siteUrl the site URL
     * @returns the retrieved results
     */
    public async getUserByLoginName(loginName: string, siteUrl: string): Promise<any> {
        let results: any = null;

        if (!loginName && !siteUrl) {
            return null;
        }

        try {
            await this._sp.web.ensureUser(loginName);
            results = await this._sp.web.siteUsers.getByLoginName(loginName)();
            //results = await web.siteUsers.getByLoginName(userId).get();
        } catch (error) {
            return Promise.reject(error);
        }
        return results;
    }

    /**
     * Getting the user profile picture 
     * @param loginName the login name
     * @returns the retrieved results
     */
    public async getUserProfilePictureUrl(loginName: string): Promise<any> {
        let results: any = null;
        try {
            // results = await this._sp.profiles.usingCaching().getPropertiesFor(loginName);
            results = await this._sp.profiles.getPropertiesFor(loginName);
        } catch (error) {
            results = null;
        }
        return results.PictureUrl;
    }

    /**
     * Getting the user permissions
     * @param siteUrl the URL of the site
     * @param listId the ID of the list
     * @returns the retrieved results
     */
    public async getUserPermissions(siteUrl: string, listId: string): Promise<IUserPermissions> {
        let hasPermissionAdd: boolean = false;
        let hasPermissionEdit: boolean = false;
        let hasPermissionDelete: boolean = false;
        let hasPermissionView: boolean = false;
        let userPermissions: IUserPermissions = undefined;
        try {
            //const userEffectivePermissions = this._sp.web.lists.getById(listId).effectiveBasePermissions
            const userEffectivePermissions = await this._sp.web.getCurrentUserEffectivePermissions()
            // ...
            hasPermissionAdd = this._sp.web.lists.getById(listId).hasPermissions(userEffectivePermissions, PermissionKind.AddListItems);
            hasPermissionDelete = this._sp.web.lists.getById(listId).hasPermissions(userEffectivePermissions, PermissionKind.DeleteListItems);
            hasPermissionEdit = this._sp.web.lists.getById(listId).hasPermissions(userEffectivePermissions, PermissionKind.EditListItems);
            hasPermissionView = this._sp.web.lists.getById(listId).hasPermissions(userEffectivePermissions, PermissionKind.ViewListItems);
            userPermissions = { hasPermissionAdd: hasPermissionAdd, hasPermissionEdit: hasPermissionEdit, hasPermissionDelete: hasPermissionDelete, hasPermissionView: hasPermissionView };

        } catch (error) {
            return Promise.reject(error);
        }
        return userPermissions;
    }

    /**
     * Getting all of the lists of a particular SharePoint site
     * @param siteUrl the site URL
     * @returns the retrieved results
     */
    public async getSiteLists(siteUrl: string): Promise<any> {

        let results: any[] = [];

        if (!siteUrl) {
            return [];
        }

        try {
            results = await this._sp.web.lists.select("Title", "ID").filter('BaseTemplate eq 106')();

        } catch (error) {
            return Promise.reject(error);
        }
        return results;
    }

    /**
     * Random generation of colour
     * @returns the colour
     */
    public async colorGenerate(): Promise<any> {

        const hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e"];
        let newColor = "#";

        for (let i = 0; i < 6; i++) {
            const x = Math.round(Math.random() * 14);

            const y = hexValues[x];
            newColor += y;
        }
        return newColor;
    }

    /**
     * Getting the choice field options
     * @param siteUrl the site URL
     * @param listId the ID of the list
     * @param fieldInternalName the internal name of the field
     * @returns the results of field options
     */
    public async getChoiceFieldOptions(siteUrl: string, listId: string, fieldInternalName: string): Promise<{ key: string, text: string }[]> {
        const fieldOptions: { key: string, text: string }[] = [];
        try {
            const results = await this._sp.web.lists.getById(listId)
                .fields
                .getByInternalNameOrTitle(fieldInternalName)
                .select("Title", "InternalName", "Choices")
                ();
            if (results && results.Choices.length > 0) {
                for (const option of results.Choices) {
                    fieldOptions.push({
                        key: option,
                        text: option
                    });
                }
            }
        } catch (error) {
            return Promise.reject(error);
        }
        return fieldOptions;
    }

    /**
     * Retrieves all events from a particular calendar (a particular 'Events' list)
     * @param siteUrl the site URL
     * @param listId the ID of the list
     * @param eventStartDate the start date to look for events from
     * @param eventEndDate the end date to look for events to
     * @returns the retrieved results
     */
    public async getEvents(siteUrl: string, listId: string, eventStartDate: Date, eventEndDate: Date): Promise<IEventData[]> {

        let events: IEventData[] = [];
        if (!siteUrl) {
            return [];
        }
        try {
            // Get Category Field Choices
            const categoryDropdownOption = await this.getChoiceFieldOptions(siteUrl, listId, 'Category');
            const categoryColor: { category: string, color: string }[] = [];
            for (const cat of categoryDropdownOption) {
                categoryColor.push({ category: cat.text, color: await this.colorGenerate() });
            }

            //  const results = await this._sp.web.lists.getById(listId).usingCaching().renderListDataAsStream(
            const results = await this._sp.web.lists.getById(listId).renderListDataAsStream(
                {
                    DatesInUtc: true,
                    ViewXml: `<View><ViewFields><FieldRef Name='RecurrenceData'/><FieldRef Name='Duration'/><FieldRef Name='Author'/><FieldRef Name='Category'/><FieldRef Name='Description'/><FieldRef Name='ParticipantsPicker'/><FieldRef Name='Geolocation'/><FieldRef Name='ID'/><FieldRef Name='EndDate'/><FieldRef Name='EventDate'/><FieldRef Name='ID'/><FieldRef Name='Location'/><FieldRef Name='Title'/><FieldRef Name='fAllDayEvent'/><FieldRef Name='EventType'/><FieldRef Name='UID' /><FieldRef Name='fRecurrence' /></ViewFields>
              <Query>
              <Where>
                <And>
                  <Geq>
                    <FieldRef Name='EventDate' />
                    <Value IncludeTimeValue='false' Type='DateTime'>${moment(eventStartDate).format('YYYY-MM-DD')}</Value>
                  </Geq>
                  <Leq>
                    <FieldRef Name='EventDate' />
                    <Value IncludeTimeValue='false' Type='DateTime'>${moment(eventEndDate).format('YYYY-MM-DD')}</Value>
                  </Leq>
                  </And>
              </Where>
              </Query>
              <RowLimit Paged="FALSE">2000</RowLimit>
              </View>`
                }
            );

            if (results && results.Row.length > 0) {
                let event: any = '';
                const mapEvents = async (): Promise<boolean> => {
                    for (event of results.Row) {
                        const eventDate = await this.getLocalTime(event.EventDate);
                        const endDate = await this.getLocalTime(event.EndDate);
                        const initialsArray: string[] = event.Author[0].title.split(' ');
                        const initials: string = initialsArray[0].charAt(0) + initialsArray[initialsArray.length - 1].charAt(0);
                        const userPictureUrl = await this.getUserProfilePictureUrl(`i:0#.f|membership|${event.Author[0].email}`);
                        const attendees: number[] = [];
                        const first: number = event.Geolocation.indexOf('(') + 1;
                        const last: number = event.Geolocation.indexOf(')');
                        const geo = event.Geolocation.substring(first, last);
                        const geolocation = geo.split(' ');
                        const CategoryColorValue: any[] = categoryColor.filter((value) => {
                            return value.category === event.Category;
                        });
                        const isAllDayEvent: boolean = event["fAllDayEvent.value"] === "1";

                        for (const attendee of event.ParticipantsPicker) {
                            attendees.push(parseInt(attendee.id));
                        }

                        events.push({
                            Id: event.ID,
                            ID: event.ID,
                            EventType: event.EventType,
                            title: await this.deCodeHtmlEntities(event.Title),
                            Description: event.Description,
                            EventDate: isAllDayEvent ? new Date(event.EventDate.slice(0, -1)) : new Date(eventDate),
                            EndDate: isAllDayEvent ? new Date(event.EndDate.slice(0, -1)) : new Date(endDate),
                            location: event.Location,
                            ownerEmail: event.Author[0].email,
                            ownerPhoto: userPictureUrl ?
                                `https://outlook.office365.com/owa/service.svc/s/GetPersonaPhoto?email=${event.Author[0].email}&UA=0&size=HR96x96` : '',
                            ownerInitial: initials,
                            color: CategoryColorValue.length > 0 ? CategoryColorValue[0].color : '#1a75ff', // blue default
                            ownerName: event.Author[0].title,
                            attendes: attendees,
                            fAllDayEvent: isAllDayEvent,
                            geolocation: { Longitude: parseFloat(geolocation[0]), Latitude: parseFloat(geolocation[1]) },
                            Category: event.Category,
                            Duration: event.Duration,
                            RecurrenceData: event.RecurrenceData ? await this.deCodeHtmlEntities(event.RecurrenceData) : "",
                            fRecurrence: event.fRecurrence,
                            RecurrenceID: event.RecurrenceID ? event.RecurrenceID : undefined,
                            MasterSeriesItemID: event.MasterSeriesItemID,
                            UID: event.UID.replace("{", "").replace("}", ""),
                        });
                    }
                    return true;
                };
                //Checks to see if there are any results saved in local storage
                if (window.localStorage.getItem("eventResult")) {
                    //if there is a local version - compares it to the current version 
                    if (window.localStorage.getItem("eventResult") === JSON.stringify(results)) {
                        //No update needed use current savedEvents
                        events = JSON.parse(window.localStorage.getItem("calendarEventsWithLocalTime"));
                    } else {
                        //update local storage
                        window.localStorage.setItem("eventResult", JSON.stringify(results));
                        //when they are not equal then we loop through the results and maps them to IEventData
                        /* tslint:disable:no-unused-expression */
                        if (await mapEvents()) {
                            window.localStorage.setItem("calendarEventsWithLocalTime", JSON.stringify(events))
                        }
                    }
                } else {
                    //if there is no local storage of the events we create them
                    window.localStorage.setItem("eventResult", JSON.stringify(results));
                    //we also needs to map through the events the first time and save the mapped version to local storage
                    if (await mapEvents()) {
                        window.localStorage.setItem("calendarEventsWithLocalTime", JSON.stringify(events))
                    }
                }
            }
            const parseEvt: parseRecurrentEvent = new parseRecurrentEvent();
            events = parseEvt.parseEvents(events, null, null);

            // Return Data
            return events;
        } catch (error) {
            console.dir(error);
            return Promise.reject(error);
        }
    }

    /**
     * Get the time zone based on regional settings
     * @param siteUrl the site URL
     * @returns 
     */
    public async getSiteRegionalSettingsTimeZone(siteUrl: string): Promise<any> {
        let regionalSettings: any;
        try {
            // regionalSettings = await this._sp.web.regionalSettings.timeZone.usingCaching().get();
            regionalSettings = await this._sp.web.regionalSettings.timeZone();

        } catch (error) {
            return Promise.reject(error);
        }
        return regionalSettings;
    }

    /**
     * Get the geo laction name
     * @param latitude the latitude number
     * @param longitude the longitude number
     * @returns the retrieved results
     */
    public async getGeoLactionName(latitude: number, longitude: number): Promise<any> {
        try {
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
            const results = await $.ajax({
                url: apiUrl,
                type: 'GET',
                dataType: 'json',
                headers: {
                    'content-type': 'application/json;charset=utf-8',
                    'accept': 'application/json;odata=nometadata',
                }
            });

            if (results) {
                return results;
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Encodes html entities based on string
     * @param string the given string
     * @returns the encoded string
     */
    public async enCodeHtmlEntities(string: string): Promise<any> {

        const HtmlEntitiesMap = {
            "'": "&apos;",
            "<": "&lt;",
            ">": "&gt;",
            " ": "&nbsp;",
            "¡": "&iexcl;",
            "¢": "&cent;",
            "£": "&pound;",
            "¤": "&curren;",
            "¥": "&yen;",
            "¦": "&brvbar;",
            "§": "&sect;",
            "¨": "&uml;",
            "©": "&copy;",
            "ª": "&ordf;",
            "«": "&laquo;",
            "¬": "&not;",
            "®": "&reg;",
            "¯": "&macr;",
            "°": "&deg;",
            "±": "&plusmn;",
            "²": "&sup2;",
            "³": "&sup3;",
            "´": "&acute;",
            "µ": "&micro;",
            "¶": "&para;",
            "·": "&middot;",
            "¸": "&cedil;",
            "¹": "&sup1;",
            "º": "&ordm;",
            "»": "&raquo;",
            "¼": "&frac14;",
            "½": "&frac12;",
            "¾": "&frac34;",
            "¿": "&iquest;",
            "À": "&Agrave;",
            "Á": "&Aacute;",
            "Â": "&Acirc;",
            "Ã": "&Atilde;",
            "Ä": "&Auml;",
            "Å": "&Aring;",
            "Æ": "&AElig;",
            "Ç": "&Ccedil;",
            "È": "&Egrave;",
            "É": "&Eacute;",
            "Ê": "&Ecirc;",
            "Ë": "&Euml;",
            "Ì": "&Igrave;",
            "Í": "&Iacute;",
            "Î": "&Icirc;",
            "Ï": "&Iuml;",
            "Ð": "&ETH;",
            "Ñ": "&Ntilde;",
            "Ò": "&Ograve;",
            "Ó": "&Oacute;",
            "Ô": "&Ocirc;",
            "Õ": "&Otilde;",
            "Ö": "&Ouml;",
            "×": "&times;",
            "Ø": "&Oslash;",
            "Ù": "&Ugrave;",
            "Ú": "&Uacute;",
            "Û": "&Ucirc;",
            "Ü": "&Uuml;",
            "Ý": "&Yacute;",
            "Þ": "&THORN;",
            "ß": "&szlig;",
            "à": "&agrave;",
            "á": "&aacute;",
            "â": "&acirc;",
            "ã": "&atilde;",
            "ä": "&auml;",
            "å": "&aring;",
            "æ": "&aelig;",
            "ç": "&ccedil;",
            "è": "&egrave;",
            "é": "&eacute;",
            "ê": "&ecirc;",
            "ë": "&euml;",
            "ì": "&igrave;",
            "í": "&iacute;",
            "î": "&icirc;",
            "ï": "&iuml;",
            "ð": "&eth;",
            "ñ": "&ntilde;",
            "ò": "&ograve;",
            "ó": "&oacute;",
            "ô": "&ocirc;",
            "õ": "&otilde;",
            "ö": "&ouml;",
            "÷": "&divide;",
            "ø": "&oslash;",
            "ù": "&ugrave;",
            "ú": "&uacute;",
            "û": "&ucirc;",
            "ü": "&uuml;",
            "ý": "&yacute;",
            "þ": "&thorn;",
            "ÿ": "&yuml;",
            "Œ": "&OElig;",
            "œ": "&oelig;",
            "Š": "&Scaron;",
            "š": "&scaron;",
            "Ÿ": "&Yuml;",
            "ƒ": "&fnof;",
            "ˆ": "&circ;",
            "˜": "&tilde;",
            "Α": "&Alpha;",
            "Β": "&Beta;",
            "Γ": "&Gamma;",
            "Δ": "&Delta;",
            "Ε": "&Epsilon;",
            "Ζ": "&Zeta;",
            "Η": "&Eta;",
            "Θ": "&Theta;",
            "Ι": "&Iota;",
            "Κ": "&Kappa;",
            "Λ": "&Lambda;",
            "Μ": "&Mu;",
            "Ν": "&Nu;",
            "Ξ": "&Xi;",
            "Ο": "&Omicron;",
            "Π": "&Pi;",
            "Ρ": "&Rho;",
            "Σ": "&Sigma;",
            "Τ": "&Tau;",
            "Υ": "&Upsilon;",
            "Φ": "&Phi;",
            "Χ": "&Chi;",
            "Ψ": "&Psi;",
            "Ω": "&Omega;",
            "α": "&alpha;",
            "β": "&beta;",
            "γ": "&gamma;",
            "δ": "&delta;",
            "ε": "&epsilon;",
            "ζ": "&zeta;",
            "η": "&eta;",
            "θ": "&theta;",
            "ι": "&iota;",
            "κ": "&kappa;",
            "λ": "&lambda;",
            "μ": "&mu;",
            "ν": "&nu;",
            "ξ": "&xi;",
            "ο": "&omicron;",
            "π": "&pi;",
            "ρ": "&rho;",
            "ς": "&sigmaf;",
            "σ": "&sigma;",
            "τ": "&tau;",
            "υ": "&upsilon;",
            "φ": "&phi;",
            "χ": "&chi;",
            "ψ": "&psi;",
            "ω": "&omega;",
            "ϑ": "&thetasym;",
            "ϒ": "&Upsih;",
            "ϖ": "&piv;",
            "–": "&ndash;",
            "—": "&mdash;",
            "‘": "&lsquo;",
            "’": "&rsquo;",
            "‚": "&sbquo;",
            "“": "&ldquo;",
            "”": "&rdquo;",
            "„": "&bdquo;",
            "†": "&dagger;",
            "‡": "&Dagger;",
            "•": "&bull;",
            "…": "&hellip;",
            "‰": "&permil;",
            "′": "&prime;",
            "″": "&Prime;",
            "‹": "&lsaquo;",
            "›": "&rsaquo;",
            "‾": "&oline;",
            "⁄": "&frasl;",
            "€": "&euro;",
            "ℑ": "&image;",
            "℘": "&weierp;",
            "ℜ": "&real;",
            "™": "&trade;",
            "ℵ": "&alefsym;",
            "←": "&larr;",
            "↑": "&uarr;",
            "→": "&rarr;",
            "↓": "&darr;",
            "↔": "&harr;",
            "↵": "&crarr;",
            "⇐": "&lArr;",
            "⇑": "&UArr;",
            "⇒": "&rArr;",
            "⇓": "&dArr;",
            "⇔": "&hArr;",
            "∀": "&forall;",
            "∂": "&part;",
            "∃": "&exist;",
            "∅": "&empty;",
            "∇": "&nabla;",
            "∈": "&isin;",
            "∉": "&notin;",
            "∋": "&ni;",
            "∏": "&prod;",
            "∑": "&sum;",
            "−": "&minus;",
            "∗": "&lowast;",
            "√": "&radic;",
            "∝": "&prop;",
            "∞": "&infin;",
            "∠": "&ang;",
            "∧": "&and;",
            "∨": "&or;",
            "∩": "&cap;",
            "∪": "&cup;",
            "∫": "&int;",
            "∴": "&there4;",
            "∼": "&sim;",
            "≅": "&cong;",
            "≈": "&asymp;",
            "≠": "&ne;",
            "≡": "&equiv;",
            "≤": "&le;",
            "≥": "&ge;",
            "⊂": "&sub;",
            "⊃": "&sup;",
            "⊄": "&nsub;",
            "⊆": "&sube;",
            "⊇": "&supe;",
            "⊕": "&oplus;",
            "⊗": "&otimes;",
            "⊥": "&perp;",
            "⋅": "&sdot;",
            "⌈": "&lceil;",
            "⌉": "&rceil;",
            "⌊": "&lfloor;",
            "⌋": "&rfloor;",
            "⟨": "&lang;",
            "⟩": "&rang;",
            "◊": "&loz;",
            "♠": "&spades;",
            "♣": "&clubs;",
            "♥": "&hearts;",
            "♦": "&diams;"
        };

        const entityMap = HtmlEntitiesMap;
        string = string.replace(/&/g, '&amp;');
        string = string.replace(/"/g, '&quot;');
        for (const key in entityMap) {
            if (key) {
                const entity = entityMap[key as keyof typeof entityMap];
                const regex = new RegExp(key, 'g');
                string = string.replace(regex, entity);
            }
        }
        return string;
    }

    /**
     * Decodes string based on given string
     * @param string the given string
     * @returns the decoded string
     */
    public async deCodeHtmlEntities(string: string): Promise<any> {

        const HtmlEntitiesMap = {
            "'": "&#39;",
            "<": "&lt;",
            ">": "&gt;",
            " ": "&nbsp;",
            "¡": "&iexcl;",
            "¢": "&cent;",
            "£": "&pound;",
            "¤": "&curren;",
            "¥": "&yen;",
            "¦": "&brvbar;",
            "§": "&sect;",
            "¨": "&uml;",
            "©": "&copy;",
            "ª": "&ordf;",
            "«": "&laquo;",
            "¬": "&not;",
            "®": "&reg;",
            "¯": "&macr;",
            "°": "&deg;",
            "±": "&plusmn;",
            "²": "&sup2;",
            "³": "&sup3;",
            "´": "&acute;",
            "µ": "&micro;",
            "¶": "&para;",
            "·": "&middot;",
            "¸": "&cedil;",
            "¹": "&sup1;",
            "º": "&ordm;",
            "»": "&raquo;",
            "¼": "&frac14;",
            "½": "&frac12;",
            "¾": "&frac34;",
            "¿": "&iquest;",
            "À": "&Agrave;",
            "Á": "&Aacute;",
            "Â": "&Acirc;",
            "Ã": "&Atilde;",
            "Ä": "&Auml;",
            "Å": "&Aring;",
            "Æ": "&AElig;",
            "Ç": "&Ccedil;",
            "È": "&Egrave;",
            "É": "&Eacute;",
            "Ê": "&Ecirc;",
            "Ë": "&Euml;",
            "Ì": "&Igrave;",
            "Í": "&Iacute;",
            "Î": "&Icirc;",
            "Ï": "&Iuml;",
            "Ð": "&ETH;",
            "Ñ": "&Ntilde;",
            "Ò": "&Ograve;",
            "Ó": "&Oacute;",
            "Ô": "&Ocirc;",
            "Õ": "&Otilde;",
            "Ö": "&Ouml;",
            "×": "&times;",
            "Ø": "&Oslash;",
            "Ù": "&Ugrave;",
            "Ú": "&Uacute;",
            "Û": "&Ucirc;",
            "Ü": "&Uuml;",
            "Ý": "&Yacute;",
            "Þ": "&THORN;",
            "ß": "&szlig;",
            "à": "&agrave;",
            "á": "&aacute;",
            "â": "&acirc;",
            "ã": "&atilde;",
            "ä": "&auml;",
            "å": "&aring;",
            "æ": "&aelig;",
            "ç": "&ccedil;",
            "è": "&egrave;",
            "é": "&eacute;",
            "ê": "&ecirc;",
            "ë": "&euml;",
            "ì": "&igrave;",
            "í": "&iacute;",
            "î": "&icirc;",
            "ï": "&iuml;",
            "ð": "&eth;",
            "ñ": "&ntilde;",
            "ò": "&ograve;",
            "ó": "&oacute;",
            "ô": "&ocirc;",
            "õ": "&otilde;",
            "ö": "&ouml;",
            "÷": "&divide;",
            "ø": "&oslash;",
            "ù": "&ugrave;",
            "ú": "&uacute;",
            "û": "&ucirc;",
            "ü": "&uuml;",
            "ý": "&yacute;",
            "þ": "&thorn;",
            "ÿ": "&yuml;",
            "Œ": "&OElig;",
            "œ": "&oelig;",
            "Š": "&Scaron;",
            "š": "&scaron;",
            "Ÿ": "&Yuml;",
            "ƒ": "&fnof;",
            "ˆ": "&circ;",
            "˜": "&tilde;",
            "Α": "&Alpha;",
            "Β": "&Beta;",
            "Γ": "&Gamma;",
            "Δ": "&Delta;",
            "Ε": "&Epsilon;",
            "Ζ": "&Zeta;",
            "Η": "&Eta;",
            "Θ": "&Theta;",
            "Ι": "&Iota;",
            "Κ": "&Kappa;",
            "Λ": "&Lambda;",
            "Μ": "&Mu;",
            "Ν": "&Nu;",
            "Ξ": "&Xi;",
            "Ο": "&Omicron;",
            "Π": "&Pi;",
            "Ρ": "&Rho;",
            "Σ": "&Sigma;",
            "Τ": "&Tau;",
            "Υ": "&Upsilon;",
            "Φ": "&Phi;",
            "Χ": "&Chi;",
            "Ψ": "&Psi;",
            "Ω": "&Omega;",
            "α": "&alpha;",
            "β": "&beta;",
            "γ": "&gamma;",
            "δ": "&delta;",
            "ε": "&epsilon;",
            "ζ": "&zeta;",
            "η": "&eta;",
            "θ": "&theta;",
            "ι": "&iota;",
            "κ": "&kappa;",
            "λ": "&lambda;",
            "μ": "&mu;",
            "ν": "&nu;",
            "ξ": "&xi;",
            "ο": "&omicron;",
            "π": "&pi;",
            "ρ": "&rho;",
            "ς": "&sigmaf;",
            "σ": "&sigma;",
            "τ": "&tau;",
            "υ": "&upsilon;",
            "φ": "&phi;",
            "χ": "&chi;",
            "ψ": "&psi;",
            "ω": "&omega;",
            "ϑ": "&thetasym;",
            "ϒ": "&Upsih;",
            "ϖ": "&piv;",
            "–": "&ndash;",
            "—": "&mdash;",
            "‘": "&lsquo;",
            "’": "&rsquo;",
            "‚": "&sbquo;",
            "“": "&ldquo;",
            "”": "&rdquo;",
            "„": "&bdquo;",
            "†": "&dagger;",
            "‡": "&Dagger;",
            "•": "&bull;",
            "…": "&hellip;",
            "‰": "&permil;",
            "′": "&prime;",
            "″": "&Prime;",
            "‹": "&lsaquo;",
            "›": "&rsaquo;",
            "‾": "&oline;",
            "⁄": "&frasl;",
            "€": "&euro;",
            "ℑ": "&image;",
            "℘": "&weierp;",
            "ℜ": "&real;",
            "™": "&trade;",
            "ℵ": "&alefsym;",
            "←": "&larr;",
            "↑": "&uarr;",
            "→": "&rarr;",
            "↓": "&darr;",
            "↔": "&harr;",
            "↵": "&crarr;",
            "⇐": "&lArr;",
            "⇑": "&UArr;",
            "⇒": "&rArr;",
            "⇓": "&dArr;",
            "⇔": "&hArr;",
            "∀": "&forall;",
            "∂": "&part;",
            "∃": "&exist;",
            "∅": "&empty;",
            "∇": "&nabla;",
            "∈": "&isin;",
            "∉": "&notin;",
            "∋": "&ni;",
            "∏": "&prod;",
            "∑": "&sum;",
            "−": "&minus;",
            "∗": "&lowast;",
            "√": "&radic;",
            "∝": "&prop;",
            "∞": "&infin;",
            "∠": "&ang;",
            "∧": "&and;",
            "∨": "&or;",
            "∩": "&cap;",
            "∪": "&cup;",
            "∫": "&int;",
            "∴": "&there4;",
            "∼": "&sim;",
            "≅": "&cong;",
            "≈": "&asymp;",
            "≠": "&ne;",
            "≡": "&equiv;",
            "≤": "&le;",
            "≥": "&ge;",
            "⊂": "&sub;",
            "⊃": "&sup;",
            "⊄": "&nsub;",
            "⊆": "&sube;",
            "⊇": "&supe;",
            "⊕": "&oplus;",
            "⊗": "&otimes;",
            "⊥": "&perp;",
            "⋅": "&sdot;",
            "⌈": "&lceil;",
            "⌉": "&rceil;",
            "⌊": "&lfloor;",
            "⌋": "&rfloor;",
            "⟨": "&lang;",
            "⟩": "&rang;",
            "◊": "&loz;",
            "♠": "&spades;",
            "♣": "&clubs;",
            "♥": "&hearts;",
            "♦": "&diams;"
        };

        const entityMap = HtmlEntitiesMap;
        for (const key in entityMap) {
            if (key) {
            const entity = entityMap[key as keyof typeof entityMap];
            const regex = new RegExp(entity, 'g');
            string = string.replace(regex, key);
            }
        }
        string = string.replace(/&quot;/g, '"');
        string = string.replace(/&amp;/g, '&');
        return string;
    }
}

const EventService = new UserEventService();
export default EventService;