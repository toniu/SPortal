import { MessageBarType } from 'office-ui-fabric-react';

export interface ISelectedGroupState {
    name: string;
    description: string;
    visibility: string;
    owners: string[];
    members: string[];
    showMessageBar: boolean;
    messageType?: MessageBarType;
    message?: string;
}