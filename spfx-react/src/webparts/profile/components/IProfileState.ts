/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUserProfile } from '../components/IUserProfile'

export interface IProfileState {
    loggedInUser: string;
    currentUser: string;
    userProfileItems: IUserProfile;
    ownerGroups: any;
    memberGroups: any;
    usersToDiscover: any;
}