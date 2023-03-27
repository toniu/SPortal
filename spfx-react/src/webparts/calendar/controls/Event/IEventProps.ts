import { IEventData } from '../../models/IEventData';
import { IPanelModelEnum} from './IPanelModeEnum';
import { WebPartContext } from "@microsoft/sp-webpart-base";

/**
 * The props for the event
 */
export interface IEventProps {
  event: IEventData;
  panelMode: IPanelModelEnum;
  onDissmissPanel: (refresh:boolean) => void;
  showPanel: boolean;
  startDate?: Date;
  endDate?: Date;
  context:WebPartContext;
  siteUrl: string;
  listId:string;
}