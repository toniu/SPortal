/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IUserProfile {
    Id: string;
    FirstName: string;
    LastName: string;
    Email: string;
    Title: string;
    WorkPhone: string;
    DisplayName: string;
    Department: string;
    PictureURL: string;
    UserProfileProperties: Array<any>;
}