/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Props for year
 */
export interface IYearProps {
    date: string;
    onDrillDown: (date: any, view?: string) => void;
  }