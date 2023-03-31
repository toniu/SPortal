/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * The model for data of an event
 */
export interface IEventData {
    Id?: number;
    ID?: number;
    title: string;
    Description?: any;
    location?: string;
    EventDate: Date;
    EndDate: Date;
    color?: any;
    ownerInitial?: string;
    ownerPhoto?: string;
    ownerEmail?: string;
    ownerName?: string;
    fAllDayEvent?: boolean;
    attendes?: number[];
    geolocation?: { Longitude: number, Latitude: number };
    Category?: string;
    Duration?: number;
    RecurrenceData?: string;
    fRecurrence?: string | boolean;
    EventType?: string;
    UID?: string;
    RecurrenceID?: Date;
    MasterSeriesItemID?: string;
  }