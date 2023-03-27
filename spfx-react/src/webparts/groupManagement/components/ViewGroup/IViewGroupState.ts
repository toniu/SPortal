/* eslint-disable @typescript-eslint/no-explicit-any */
import { MessageBarType } from 'office-ui-fabric-react';

/**
 * View group state
 */
export interface IViewGroupState {
    id: any;
    spId: any;
    name: string;
    description: string;
    visibility: string;
    owners: any[];
    members: any[];
    showMessageBar: boolean;
    originalState: any;
    messageType?: MessageBarType;
    message?: string;
}