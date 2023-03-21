/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import * as moment from "moment";
import styles from "./Year.module.scss";
import { IYearCalendarState } from "./IYearCalendarState";
import { IYearCalendarProps } from "./IYearCalendarProps";
import { css } from "office-ui-fabric-react";


export interface ICalendar {
    currentDate: any;
    first: any;
    last: any;
    year: any;
    month: any;
}

function createCalendar(currentDate: any): any {
    if (!currentDate) {
      currentDate = moment();
    } else {
      currentDate = moment(currentDate);
    }
  
    const first = currentDate.clone().startOf('month');
    const last = currentDate.clone().endOf('month');
    const weeksCount = Math.ceil((first.day() + last.date()) / 7);
    const calendar: any = [];
    calendar.currentDate = currentDate;
    calendar.last = last;
    calendar.first = first;
  
    for (let weekNumber = 0; weekNumber < weeksCount; weekNumber++) {
      const week: any[] = [];
      calendar.push(week);
      calendar.year = currentDate.year();
      calendar.month = currentDate.month();
  
      for (let day = 7 * weekNumber; day < 7 * (weekNumber + 1); day++) {
        const date = currentDate.clone().set('date', day + 1 - first.day());
        date.calendar = calendar;
        week.push(date);
      }
    }
    return calendar;
  }

function CalendarDate(props: any): any {
    const { dateToRender, dateOfMonth } = props;
    const today =
      dateToRender.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')
        ? styles.today
        : '';
  
    if (dateToRender.month() < dateOfMonth.month()) {
      return (
        <button disabled={true} className={css(styles.date, styles.prevMonth)}>
          {dateToRender.date()}
        </button>
      );
    }
  
    if (dateToRender.month() > dateOfMonth.month()) {
      return (
        <button disabled={true} className={css(styles.date, styles.nextMonth)}>
          {dateToRender.date()}
        </button>
      );
    }
  
    return (
      <button
        className={`${css(styles.date, styles.inMonth)} ${today}`}
        onClick={(e) => props.onClick(e, dateToRender)}>
        {dateToRender.date()}
      </button>
    );
  }

export default class YearCalendar extends React.Component<IYearCalendarProps, IYearCalendarState> {
    constructor(props: IYearCalendarProps) {
        super(props);

        this.state = {
            calendar: undefined
        };
    }

    public componentDidMount(): void {
        this.setState({ calendar: createCalendar(this.props.date) });
    }

    public componentDidUpdate(prevProps: IYearCalendarProps): void {
        if (this.props.date !== prevProps.date) {
            this.setState({ calendar: createCalendar(this.props.date) });
        }
    }

    public render(): React.ReactElement<IYearCalendarProps> {
        if (!this.state.calendar) {
            return null;
        }

        const weekdays: string[] = this.state.calendar.currentDate.localeData().weekdaysMin();

        return (
            <div className={styles.month}>
                <div className={styles.monthName}>
                    {this.state.calendar.currentDate.format('MMMM').toUpperCase()}
                </div>
                {weekdays.map((day, index) => (
                    <span key={index} className={styles.day}>
                        {day}
                    </span>
                ))}
                {this.state.calendar.map((week: any, index: any) => (
                    <div key={index}>
                        {week.map((date: any) => (
                            <CalendarDate
                                key={date.date()}
                                dateToRender={date}
                                dateOfMonth={this.state.calendar.currentDate}
                                onClick={(e: any, obj: any) => {
                                    this.openView(obj.toDate(), "day", e); //open day-view
                                }
                                }
                            />
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    private openView = (date: any, view: any, e: any): void => {
        e.preventDefault();
        this.props.onDrillDown(date, view);
    }
}