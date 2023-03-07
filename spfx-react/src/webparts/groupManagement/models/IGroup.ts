/* eslint-disable @typescript-eslint/no-explicit-any */
// Represents attributes of an O365 Group
export interface IGroup {
    id: string;
    displayName: string;
    description?: string;
    visibility?: string;
    SPId: number;
    url?: string;
    thumbnail?: string;
    userRole?: string;
    teamsConnected?: boolean;
}

export interface IGroupCollection {
    value: IGroup[];
}