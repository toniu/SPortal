/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Represents attributes of an O365 group
 */
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

/**
 * Collection of groups
 */
export interface IGroupCollection {
    value: IGroup[];
}