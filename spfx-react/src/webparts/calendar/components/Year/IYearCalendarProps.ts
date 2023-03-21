/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IYearCalendarProps {
    date: Date;
    onDrillDown: (date: any, view?: string) => void;
  }