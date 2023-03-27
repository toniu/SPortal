/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUserProfile } from '../components/IUserProfile'

/**
 * The state for the profile
 */
export interface IProfileState {
    loggedInUser: string;
    currentUser: string;
    userProfileItems: IUserProfile;
    ownerGroups: any;
    memberGroups: any;
    usersToDiscover: any;
}