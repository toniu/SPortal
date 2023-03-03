/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGroup } from "../../models/IGroup";

export interface IGroupListState {
    filterText?: string;
    showDialog: boolean;
    selectedGroup: any;
    isTeachingBubbleVisible?: boolean;
    techingBubbleMessage?: string;
    groups?: IGroup[];
    ownerGroups?: string[];
    memberGroups?: string[];
  }