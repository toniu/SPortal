/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUserProfile } from '../webparts/profile/components/IUserProfile'; 
  
export interface IDataService {  
    getUserProfileProperties: (who: string) => Promise<IUserProfile>; 
}