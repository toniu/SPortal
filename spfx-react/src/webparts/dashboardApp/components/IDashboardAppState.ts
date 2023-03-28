import { IUserInfo } from "../../pollManagement/models"

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IDashboardAppState {
    eventData: any[],
    currentUserData: IUserInfo,
    hasError: boolean,
    isLoading: boolean,
    recentEvents: any[],
    upcomingEvents: any[]
  }