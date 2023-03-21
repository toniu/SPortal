/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IYearProps {
    date: string;
    onDrillDown: (date: any, view?: string) => void;
  }