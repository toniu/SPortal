import { WebPartContext } from "@microsoft/sp-webpart-base";

/**
 * The props for the event reccurence info daily
 */
export interface  IEventRecurrenceInfoDailyProps {
  display:boolean;
  recurrenceData: string;
  startDate:Date;
  context: WebPartContext;
  siteUrl:string;
  returnRecurrenceData: (startDate:Date,recurrenceData:string) => void;
}