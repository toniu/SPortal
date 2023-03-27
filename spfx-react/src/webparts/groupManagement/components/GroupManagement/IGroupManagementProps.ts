import { WebPartContext } from '@microsoft/sp-webpart-base'; 

/**
 * The group management props
 */
export interface IGroupManagementProps {
  flowUrl: string;
  context: WebPartContext;  
}