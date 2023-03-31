import { MessageBarType } from 'office-ui-fabric-react';

/**
 * The new group state
 */
export interface INewGroupState {
    name: string;
    description: string;
    visibility: string;
    owners: string[];
    members: string[];
    showMessageBar: boolean;
    messageType?: MessageBarType;
    message?: string;
}