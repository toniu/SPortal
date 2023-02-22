import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IGroupsProps {
  description: string;
  userDisplayName: string;
  spcontext: WebPartContext;
}
