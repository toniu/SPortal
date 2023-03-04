import { MessageBarType } from 'office-ui-fabric-react';

export interface IViewGroupState {
    name: string;
    description: string;
    visibility: string;
    originalOwners: string[];
    originalMembers: string[];
    showMessageBar: boolean;
    messageType?: MessageBarType;
    message?: string;
}