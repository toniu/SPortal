/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUserProfile } from '../webparts/profile/components/IUserProfile'; 
 
/**
 * Interface for data service
 */
export interface IDataService {
    /**
     * Retrieves the user profile properties
     * @param who The user email
     * @returns User profile as a promise
     */  
    getUserProfileProperties: (who: string) => Promise<IUserProfile>; 
}