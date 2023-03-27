/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGroup } from "../../models/IGroup";

/**
 * The group list state
 */
export interface IGroupListState {
    filterText?: string;
    showDialog: boolean;
    selectedGroup: any;
    showSelectedGroup: boolean;
    isTeachingBubbleVisible?: boolean;
    techingBubbleMessage?: string;
    groups?: IGroup[];
    ownerGroups?: string[];
    memberGroups?: string[];
  }