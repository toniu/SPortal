import { ServiceScope } from '@microsoft/sp-core-library'

export interface IProfileProps {
  description: string;
  userDisplayName: string;
  userName: string;
  serviceScope: ServiceScope;
}
