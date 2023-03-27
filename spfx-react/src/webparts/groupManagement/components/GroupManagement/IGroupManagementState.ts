import { IGroup } from "../../models/IGroup";

/**
 * The group management state
 */
export interface IGroupManagementState {
    isLoading: boolean;
    groups: IGroup[];
    ownerGroups: string[];
    memberGroups: string[];
    showNewGroupScreen: boolean;
    loadCount: number;
}