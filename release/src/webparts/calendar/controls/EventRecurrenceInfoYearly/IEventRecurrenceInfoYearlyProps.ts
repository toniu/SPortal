import { WebPartContext } from "@microsoft/sp-webpart-base";
/**
 * The props for event recurrence info yearly
 */
export interface  IEventRecurrenceInfoYearlyProps {
  display:boolean;
  recurrenceData: string;
  startDate:Date;
  context: WebPartContext;
  siteUrl:string;
  returnRecurrenceData: (startDate:Date,recurrenceData:string) => void;
}