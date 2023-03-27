import { ServiceScope } from '@microsoft/sp-core-library'
import { WebPartContext } from '@microsoft/sp-webpart-base';

/**
 * The props for the profile
 */
export interface IProfileProps {
  description: string;
  userDisplayName: string;
  userName: string;
  serviceScope: ServiceScope;
  context: WebPartContext;
}
