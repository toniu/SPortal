import { IPanelModelEnum} from '../controls/Event/IPanelModeEnum';
import { IEventData } from './../models/IEventData';

/**
 * The state for the calendar
 */
export interface ICalendarState {
  showDialog: boolean;
  eventData:  IEventData[];
  selectedEvent: IEventData;
  panelMode?: IPanelModelEnum;
  startDateSlot?: Date;
  endDateSlot?:Date;
  isloading: boolean;
  hasError: boolean;
  errorMessage: string;
}