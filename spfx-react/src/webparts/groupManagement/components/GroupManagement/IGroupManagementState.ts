import { IGroup } from "../../models/IGroup";

export interface IGroupManagementState {
    isLoading: boolean;
    groups: IGroup[];
    ownerGroups: string[];
    memberGroups: string[];
    showNewGroupScreen: boolean;
    loadCount: number;
}