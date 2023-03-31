/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import * as dates from 'date-arithmetic';
import styles from './Year.module.scss';
import { Navigate } from 'react-big-calendar';
import { IYearProps } from './IYearProps';
import YearCalendar from "./YearCalendar";

/**
 * Interface for the calendar
 */
export interface ICalendar {
  currentDate: any;
  first: any;
  last: any;
  year: any;
  month: any;
}

/**
 * Component for year
 */
export default class Year extends React.Component<IYearProps> {
  constructor(props: IYearProps) {
    super(props);
  }
  
  /**
   * The action to move next year or previous year
   * @param date the date
   * @param action going forwards or backwards?
   * @returns 
   */
  public static navigate = (date: any, action: any): any => {
    switch (action) {
      case Navigate.PREVIOUS:
        return dates.add(date, -1, 'year');

      case Navigate.NEXT:
        return dates.add(date, 1, 'year');

      default:
        return date;
    }
  }

  /**
   * Formats the title
   * @param date the date
   * @param calendar the calendar
   * @returns the formatted date
   */
  public static title = (date: any, calendar: any): any => {
    return calendar.localizer.format(date, "YYYY");
  }

  /**
   * Handles the heading click
   * @param date the date
   * @param view the view
   */
  private handleHeadingClick = (date: any, view: any): any => {
    this.props.onDrillDown(date, view);
  }

  /**
   * The render
   * @returns JSX element
   */
  public render(): React.ReactElement<IYearProps> {
    const { date } = this.props;
    // const range = this.range(date);
    const months = [];
    const firstMonth = dates.startOf(new Date(date), 'year');

    for (let i = 0; i < 12; i++) {
      months.push(
        <YearCalendar
          key={i + 1}
          date={dates.add(firstMonth, i, 'month')}
          onDrillDown={this.handleHeadingClick}
        />
      );
    }

    return <div className={styles.year}>{months.map(month => month)}</div>;
  }
}