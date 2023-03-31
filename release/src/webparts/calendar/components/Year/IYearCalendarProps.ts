/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Props for the year calendar
 */
export interface IYearCalendarProps {
    date: Date;
    onDrillDown: (date: any, view?: string) => void;
  }