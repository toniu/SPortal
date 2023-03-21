/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import * as dates from 'date-arithmetic';
import styles from './Year.module.scss';
import { Navigate } from 'react-big-calendar';
import { IYearProps } from './IYearProps';
import YearCalendar from "./YearCalendar";

export interface ICalendar {
  currentDate: any;
  first: any;
  last: any;
  year: any;
  month: any;
}

export default class Year extends React.Component<IYearProps> {
  constructor(props: IYearProps) {
    super(props);
  }

  /*
  private range = (date: any): any => {
    return [dates.startOf(date, 'year')];
  }
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

  public static title = (date: any, calendar: any): any => {
    return calendar.localizer.format(date, "YYYY");
  }

  private handleHeadingClick = (date: any, view: any): any => {
    this.props.onDrillDown(date, view);
  }

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