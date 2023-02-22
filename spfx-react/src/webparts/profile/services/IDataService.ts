/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUserProfile } from '../components/IUserProfile'; 
  
export interface IDataService {  
    getUserProfileProperties: () => Promise<IUserProfile>; 
}