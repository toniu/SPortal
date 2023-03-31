/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import * as strings from 'CalendarWebPartStrings';
import { IEventRecurrenceInfoDailyProps } from './IEventRecurrenceInfoDailyProps';
import { IEventRecurrenceInfoDailyState } from './IEventRecurrenceInfoDailyState';
import * as moment from 'moment';
import { parseString } from "xml2js";
import {
  ChoiceGroup,
  IChoiceGroupOption,
  Label,
  MaskedTextField,
} from 'office-ui-fabric-react';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { toLocaleShortDateString } from '../../utils/dateUtils';

/* Services */
import UserEventService from '../../../../services/UserEventService';

/**
 * The strings for day pickers
 */
const DayPickerStrings: IDatePickerStrings = {
  months: [strings.January, strings.February, strings.March, strings.April, strings.May, strings.June, strings.July, strings.August, strings.September, strings.October, strings.November, strings.December],
  shortMonths: [strings.Jan, strings.Feb, strings.Mar, strings.Apr, strings.May, strings.Jun, strings.Jul, strings.Aug, strings.Sep, strings.Oct, strings.Nov, strings.Dez],
  days: [strings.Sunday, strings.Monday, strings.Tuesday, strings.Wednesday, strings.Thursday, strings.Friday, strings.Saturday],
  shortDays: [strings.ShortDay_S, strings.ShortDay_M, strings.ShortDay_T, strings.ShortDay_W, strings.ShortDay_Thursday, strings.ShortDay_Friday, strings.ShortDay_Sunday],
  goToToday: strings.GoToDay,
  prevMonthAriaLabel: strings.PrevMonth,
  nextMonthAriaLabel: strings.NextMonth,
  prevYearAriaLabel: strings.PrevYear,
  nextYearAriaLabel: strings.NextYear,
  closeButtonAriaLabel: strings.CloseDate,
  isRequiredErrorMessage: strings.IsRequired,
  invalidInputErrorMessage: strings.InvalidDateFormat,
};

/**
 * The component for event recurrence daily
 */
export class EventRecurrenceInfoDaily extends React.Component<IEventRecurrenceInfoDailyProps, IEventRecurrenceInfoDailyState> {
  /**
   * Constructor: Initial state and binding of functions
   * @param props the props
   */
  public constructor(props: IEventRecurrenceInfoDailyProps) {
    super(props);


    this.onPatternChange = this.onPatternChange.bind(this);
    this.state = {
      selectedKey: 'daily',
      selectPatern: 'every',
      startDate: this.props.startDate ? this.props.startDate : moment().toDate(),
      endDate: moment().endOf('month').toDate(),
      numberOcurrences: '1',
      numberOfDays: '1',
      disableNumberOfDays: false,
      disableNumberOcurrences: true,
      selectdateRangeOption: 'noDate',
      disableEndDate: true,
      selectedRecurrenceRule: 'daily',
      isLoading: false,
      errorMessageNumberOcurrences: '',
      errorMessageNumberOfDays: '',
    };

    //
    this.onNumberOfDaysChange = this.onNumberOfDaysChange.bind(this);
    this.onNumberOfOcurrencesChange = this.onNumberOfOcurrencesChange.bind(this);
    this.onDataRangeOptionChange = this.onDataRangeOptionChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onApplyRecurrence = this.onApplyRecurrence.bind(this);

  }

  /**
   * Start date for event recurrence
   * @param date new date
   */
  private onStartDateChange(date: Date): void {
    // Put the applyRecurrence() function in the callback of the setState() method to make sure that applyRecurrence() applied after the state change is complete. 
    this.setState({ startDate: date }, () => {
      this.applyRecurrence().catch((e: any) => console.log(e));
    });
  }

  /**
  * End date for event recurrence
  * @param date new date
  */
  private onEndDateChange(date: Date): void {
    // Put the applyRecurrence() function in the callback of the setState() method to make sure that applyRecurrence() applied after the state change is complete.
    this.setState({ endDate: date }, () => {
      this.applyRecurrence().catch((e: any) => console.log(e));
    });
  }

  /**
   * Change of input for number of days 
   * @param ev event
   * @param value new value
   */
  private onNumberOfDaysChange(ev: React.SyntheticEvent<HTMLElement>, value: string): void {
    ev.preventDefault();
    let errorMessage = '';
    setTimeout(() => {

      if (Number(value.trim()) === 0 || Number(value.trim()) > 255) {
        value = '1  ';
        errorMessage = 'Allowed values 1 to 255';
      }
      this.setState({ numberOfDays: value, errorMessageNumberOfDays: errorMessage });
      this.applyRecurrence().catch((e: any) => console.log(e));
    }, 2500);

  }


  /**
   * Change of input for number of occurences
   * @param ev event
   * @param value new value
   */
  private onNumberOfOcurrencesChange(ev: React.SyntheticEvent<HTMLElement>, value: string): void {
    ev.preventDefault();
    let errorMessage = '';
    setTimeout(() => {

      if (Number(value.trim()) === 0 || Number(value.trim()) > 999) {
        value = '1  ';
        errorMessage = 'Allowed values 1 to 999';
      }
      this.setState({ numberOcurrences: value, errorMessageNumberOcurrences: errorMessage });
      this.applyRecurrence().catch((e: any) => console.log(e));
    }, 2500);

  }

  /**
   * Change of input for data range option
   * @param ev event
   * @param option option
   */
  private onDataRangeOptionChange(
    ev: React.SyntheticEvent<HTMLElement>,
    option: IChoiceGroupOption
  ): void {
    ev.preventDefault();
    // Put the applyRecurrence() function in the callback of the setState() method to make sure that applyRecurrence() applied after the state change is complete.
    this.setState(
      {
        selectdateRangeOption: option.key,
        disableNumberOcurrences: option.key === "endAfter" ? false : true,
        disableEndDate: option.key === "endDate" ? false : true,
      },
      () => {
        this.applyRecurrence().catch((e: any) => console.log(e));
      }
    );
  }

  /**
   * Change of input for pattern change
   * @param ev event
   * @param option option
   */
  private onPatternChange(
    ev: React.SyntheticEvent<HTMLElement>,
    option: IChoiceGroupOption
  ): void {
    ev.preventDefault();
    // Put the applyRecurrence() function in the callback of the setState() method to make sure that applyRecurrence() applied after the state change is complete.
    this.setState(
      {
        selectPatern: option.key,
        disableNumberOfDays: option.key === "every" ? false : true,
      },
      () => {
        this.applyRecurrence().catch((e: any) => console.log(e));
      }
    );
  }

  /**
   * When component mounted, begin loading
   */
  public async componentDidMount(): Promise<void> {
    //  await this.load();
    await this.load();
  }

  /**
   * Loads the recurrence
   */
  private async load(): Promise<void> {
    let patern: any = {};
    let dateRange: { repeatForever?: string, repeatInstances?: string, windowEnd?: Date } = {};
    let dailyPatern: { dayFrequency?: string, weekDay?: string } = {};
    let recurrenceRule: string;

    if (this.props.recurrenceData) {

      parseString(this.props.recurrenceData, { explicitArray: false }, (error, result) => {

        if (result.recurrence.rule.repeat) {
          patern = result.recurrence.rule.repeat;
        }

        //
        if (result.recurrence.rule.repeatForever) {
          dateRange = { repeatForever: result.recurrence.rule.repeatForever };
        }
        if (result.recurrence.rule.repeatInstances) {
          dateRange = { repeatInstances: result.recurrence.rule.repeatInstances };
        }
        if (result.recurrence.rule.windowEnd) {
          dateRange = { windowEnd: result.recurrence.rule.windowEnd };
        }

      });

      /* Daily Patern */
      if (patern.daily) {
        recurrenceRule = 'daily';
        if (patern.daily.$.dayFrequency) {
          dailyPatern = { dayFrequency: patern.daily.$.dayFrequency };
        }
        if (patern.daily.$.weekday) {
          dailyPatern = { weekDay: 'weekDay' };
        }
      }

      let selectDateRangeOption: string = 'noDate';
      if (dateRange.repeatForever) {
        selectDateRangeOption = 'noDate';
      } else if (dateRange.repeatInstances) {
        selectDateRangeOption = 'endAfter';
      } else if (dateRange.windowEnd) {
        selectDateRangeOption = 'endDate';
      }

      /* Weekday patern */
      this.setState({
        selectedRecurrenceRule: recurrenceRule,
        selectPatern: dailyPatern.dayFrequency ? 'every' : 'everweekday',
        numberOfDays: dailyPatern.dayFrequency ? dailyPatern.dayFrequency : '1',
        disableNumberOfDays: dailyPatern.dayFrequency ? false : true,
        selectdateRangeOption: selectDateRangeOption,
        numberOcurrences: dateRange.repeatInstances ? dateRange.repeatInstances : '10',
        disableNumberOcurrences: dateRange.repeatInstances ? false : true,
        endDate: dateRange.windowEnd ? new Date(moment(dateRange.windowEnd).format('YYYY/MM/DD')) : this.state.endDate,
        disableEndDate: dateRange.windowEnd ? false : true,
        isLoading: false,
      });
    }
    await this.applyRecurrence();
  }

  /**
   * Button click to apply the reccurence
   * @param ev the event
   */
  private async onApplyRecurrence(ev: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    await this.applyRecurrence();
  }
 
  /**
   * Function to apply the reccurence
   */
  private async applyRecurrence(): Promise<void> {
    const endDate = await UserEventService.getUtcTime(this.state.endDate);
    let selectDateRangeOption;
    switch (this.state.selectdateRangeOption) {
      case 'noDate':
        selectDateRangeOption = `<repeatForever>FALSE</repeatForever>`;
        break;
      case 'endAfter':
        selectDateRangeOption = `<repeatInstances>${this.state.numberOcurrences}</repeatInstances>`;
        break;
      case 'endDate':
        selectDateRangeOption = `<windowEnd>${endDate}</windowEnd>`;
        break;
      default:
        break;
    }
    const recurrenceXML = `<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat>` +
      `<daily ${this.state.selectPatern === 'every' ? `dayFrequency="${this.state.numberOfDays.trim()}"/>` : 'weekday'}</repeat>${selectDateRangeOption}</rule></recurrence>`;
    //  console.log(recurrenceXML);
    this.props.returnRecurrenceData(this.state.startDate, recurrenceXML);
  }
  
  /**
   * The render
   * @returns JSX element
   */
  public render(): React.ReactElement<IEventRecurrenceInfoDailyProps> {
    return (
      <div >
        {
          <div>
            <div style={{ display: 'inline-block', float: 'right', paddingTop: '10px', height: '40px' }} />
            <div style={{ width: '100%', paddingTop: '10px' }}>
              <Label>{strings.patternLabel}</Label>
              <ChoiceGroup
                selectedKey={this.state.selectPatern}
                options={[
                  {
                    key: 'every',
                    text: strings.every,
                    ariaLabel: 'every',

                    onRenderField: (props, render) => {
                      return (
                        <div  >
                          {render?.(props)}
                          <MaskedTextField
                            styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '100px', paddingLeft: '10px' } }}
                            mask="999"
                            maskChar=' '
                            disabled={this.state.disableNumberOfDays}
                            value={this.state.numberOfDays}
                            errorMessage={this.state.errorMessageNumberOfDays}
                            onChange={this.onNumberOfDaysChange} />
                          <Label styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '60px', paddingLeft: '10px' } }}>{strings.days}</Label>
                        </div>
                      );
                    }
                  },
                  {
                    key: 'everweekday',
                    text: strings.everyweekdays,
                  }
                ]}
                onChange={this.onPatternChange}
                required={true}
              />
            </div>

            <div style={{ paddingTop: '22px' }}>
              <Label>{strings.dateRangeLabel}</Label>
              <div style={{ display: 'inline-block', verticalAlign: 'top', paddingRight: '35px', paddingTop: '10px' }}>

                <DatePicker
                  firstDayOfWeek={DayOfWeek.Sunday}
                  strings={DayPickerStrings}
                  placeholder={strings.StartDatePlaceHolder}
                  ariaLabel={strings.StartDatePlaceHolder}
                  label={strings.StartDateLabel}
                  value={this.state.startDate}
                  onSelectDate={this.onStartDateChange}
                  formatDate={toLocaleShortDateString}
                />

              </div>
              <div style={{ display: 'inline-block', verticalAlign: 'top', paddingTop: '10px' }}>
                <ChoiceGroup
                  selectedKey={this.state.selectdateRangeOption}
                  onChange={this.onDataRangeOptionChange}
                  options={[
                    {
                      key: 'noDate',
                      text: strings.noEndDate,
                    },
                    {
                      key: 'endDate',
                      text: strings.EndByLabel,
                      onRenderField: (props, render) => {
                        return (
                          <div  >
                            {render?.(props)}
                            <DatePicker
                              firstDayOfWeek={DayOfWeek.Sunday}
                              strings={DayPickerStrings}
                              placeholder={strings.StartDatePlaceHolder}
                              ariaLabel="Select a date"
                              style={{ display: 'inline-block', verticalAlign: 'top', paddingLeft: '22px', }}
                              onSelectDate={this.onEndDateChange}
                              formatDate={toLocaleShortDateString}
                              value={this.state.endDate}
                              disabled={this.state.disableEndDate}

                            />
                          </div>
                        );
                      }
                    },
                    {
                      key: 'endAfter',
                      text: strings.EndAfterLabel,
                      onRenderField: (props, render) => {
                        return (
                          <div  >
                            {render?.(props)}
                            <MaskedTextField
                              styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '100px', paddingLeft: '10px' } }}
                              mask="999"
                              maskChar=' '
                              value={this.state.numberOcurrences}
                              disabled={this.state.disableNumberOcurrences}
                              errorMessage={this.state.errorMessageNumberOcurrences}
                              onChange={this.onNumberOfOcurrencesChange} />
                            <Label styles={{ root: { display: 'inline-block', verticalAlign: 'top', paddingLeft: '10px' } }}>{strings.occurrencesLabel}</Label>
                          </div>
                        );
                      }
                    },
                  ]}
                  required={true}
                />
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}