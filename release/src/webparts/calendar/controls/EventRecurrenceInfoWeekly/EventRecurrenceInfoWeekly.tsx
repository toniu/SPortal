/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import styles from './EventRecurrenceInfoWeekly.module.scss';
import * as strings from 'CalendarWebPartStrings';
import { IEventRecurrenceInfoWeeklyProps } from './IEventRecurrenceInfoWeeklyProps';
import { IEventRecurrenceInfoWeeklyState } from './IEventRecurrenceInfoWeeklyState';
import * as moment from 'moment';
import { parseString } from "xml2js";
import {
  ChoiceGroup,
  IChoiceGroupOption,
  Label,
  MaskedTextField,
  Checkbox,
} from 'office-ui-fabric-react';
import { DatePicker, DayOfWeek, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { toLocaleShortDateString } from '../../utils/dateUtils';
/* Services */
import UserEventService from '../../../../services/UserEventService';

/**
 * The strings for date picker
 */
const DayPickerStrings: IDatePickerStrings = {
  months: [strings.January, strings.February, strings.March, strings.April, strings.May, strings.June, strings.July, strings.August, strings.September, strings.October, strings.November, strings.December],

  shortMonths: [strings.Jan, strings.Feb, strings.Mar, strings.Apr, strings.May, strings.Jun, strings.Jul, strings.Aug, strings.Sep, strings.Oct, strings.Nov, strings.Dez],

  days: [strings.Sunday, strings.Monday, strings.Tuesday, strings.Wednesday, strings.Thursday, strings.Friday, strings.Saturday],

  shortDays: [strings.ShortDay_Sunday, strings.ShortDay_M, strings.ShortDay_T, strings.ShortDay_W, strings.ShortDay_Thursday, strings.ShortDay_Friday, strings.ShortDay_S],

  goToToday: strings.GoToDay,
  prevMonthAriaLabel: strings.PrevMonth,
  nextMonthAriaLabel: strings.NextMonth,
  prevYearAriaLabel: strings.PrevYear,
  nextYearAriaLabel: strings.NextYear,
  closeButtonAriaLabel: strings.CloseDate
};

/**
 * The component for event reccurence info weekly
 */
export class EventRecurrenceInfoWeekly extends React.Component<IEventRecurrenceInfoWeeklyProps, IEventRecurrenceInfoWeeklyState> {
  public constructor(props: IEventRecurrenceInfoWeeklyProps) {
    super(props);
    this.onPaternChange = this.onPaternChange.bind(this);


    this.state = {
      selectedKey: 'daily',
      selectPatern: 'every',
      startDate: this.props.startDate ? this.props.startDate : moment().toDate(),
      endDate: moment().endOf('month').toDate(),
      numberOcurrences: '10',
      numberOfWeeks: '1',
      disableNumberOfWeeks: false,
      disableNumberOcurrences: true,
      selectdateRangeOption: 'noDate',
      disableEndDate: true,
      weeklySunday: moment().weekday() === 0 ? true : false,
      weeklyMonday: moment().weekday() === 1 ? true : false,
      weekklyTuesday: moment().weekday() === 2 ? true : false,
      weekklyWednesday: moment().weekday() === 3 ? true : false,
      weekklyThursday: moment().weekday() === 4 ? true : false,
      weeklyFriday: moment().weekday() === 5 ? true : false,
      weeklySaturday: moment().weekday() === 6 ? true : false,
      isLoading: false,
      errorMessageNumberOfWeeks: '',
    };

    //
    this.onNumberOfWeeksChange = this.onNumberOfWeeksChange.bind(this);
    this.onNumberOfOcurrencesChange = this.onNumberOfOcurrencesChange.bind(this);
    this.onDataRangeOptionChange = this.onDataRangeOptionChange.bind(this);
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
    this.onApplyRecurrence = this.onApplyRecurrence.bind(this);
    this.onCheckboxSundayChange = this.onCheckboxSundayChange.bind(this);
    this.onCheckboxMondayChange = this.onCheckboxMondayChange.bind(this);
    this.onCheckboxTuesdayChange = this.onCheckboxTuesdayChange.bind(this);
    this.onCheckboxWednesdayChange = this.onCheckboxWednesdayChange.bind(this);
    this.onCheckboxThursdayChange = this.onCheckboxThursdayChange.bind(this);
    this.onCheckboxFridayChange = this.onCheckboxFridayChange.bind(this);
    this.onCheckboxSaturdayChange = this.onCheckboxSaturdayChange.bind(this);
  }

  /**
   * Start date for event recurrence
   * @param date new date
   */
  private onStartDateChange(date: Date): void {
    //Put the applyRecurrence() function in the callback of the setState() method to make sure that applyRecurrence() applied after the state change is complete.
    this.setState({ startDate: date }, () => {
      this.applyRecurrence().catch((e: any) => console.log(e));
    });
  }

  /**
   * End date for event recurrence
   * @param date new date
   */
  private onEndDateChange(date: Date): void {
    //Put the applyRecurrence() function in the callback of the setState() method to make sure that applyRecurrence() applied after the state change is complete.
    this.setState({ endDate: date }, () => {
      this.applyRecurrence().catch((e: any) => console.log(e));
    }
    );
  }

  /**
   * Change of input for number of weeks
   * @param ev event
   * @param value new value
   */
  private onNumberOfWeeksChange(ev: React.SyntheticEvent<HTMLElement>, value: string): void {
    ev.preventDefault();
    setTimeout(() => {
      let errorMessage: string = '';
      if (Number(value.trim()) === 0 || Number(value.trim()) > 255) {
        value = '1  ';
        errorMessage = 'Allowed values 1 to 255';
      }
      this.setState({ numberOfWeeks: value, errorMessageNumberOfWeeks: errorMessage });
      this.applyRecurrence().catch((e: any) => console.log(e));
    }, 2000);


  }


  /**
   * Change of input for number of occurences
   * @param ev event
   * @param value new value
   */
  private onNumberOfOcurrencesChange(ev: React.SyntheticEvent<HTMLElement>, value: string): void {
    ev.preventDefault();
    setTimeout(() => {
      this.setState({ numberOcurrences: value.trim().length > 0 ? value : "10 " });
      this.applyRecurrence().catch((e: any) => console.log(e));
    }, 2000);

  }

  /**
   * Change of input for data range option
   * @param ev event
   * @param option new option
   */
  private onDataRangeOptionChange(
    ev: React.SyntheticEvent<HTMLElement>,
    option: IChoiceGroupOption
  ): void {
    ev.preventDefault();
    //Put the applyRecurrence() function in the callback of the setState() method to make sure that applyRecurrence() applied after the state change is complete.
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
   * Change of input for pattern
   * @param ev event
   * @param option new option
   */
  private onPaternChange(
    ev: React.SyntheticEvent<HTMLElement>,
    option: IChoiceGroupOption
  ): void {
    ev.preventDefault();
    //Put the applyRecurrence() function in the callback of the setState() method to make sure that applyRecurrence() applied after the state change is complete.
    this.setState(
      {
        selectPatern: option.key,
        disableNumberOfWeeks: option.key === "every" ? false : true,
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
    let weeklyPatern: { weekFrequency?: string, su?: boolean, mo?: boolean, tu?: boolean, we?: boolean, th?: boolean, fr?: boolean, sa?: boolean } = {};


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
      // daily Patern
      if (patern.weekly) {

        weeklyPatern = patern.weekly.$.weekFrequency ? { weekFrequency: patern.weekly.$.weekFrequency } : { weekFrequency: 1 };
        const weeklysu = patern.weekly.$.su ? true : false;
        const weeklymo = patern.weekly.$.mo ? true : false;
        const weeklytu = patern.weekly.$.tu ? true : false;
        const weeklywe = patern.weekly.$.we ? true : false;
        const weeklyth = patern.weekly.$.th ? true : false;
        const weeklyfr = patern.weekly.$.fr ? true : false;
        const weeklysa = patern.weekly.$.sa ? true : false;
        weeklyPatern = { su: weeklysu, mo: weeklymo, tu: weeklytu, we: weeklywe, th: weeklyth, fr: weeklyfr, sa: weeklysa };

      }

      let selectDateRangeOption: string = 'noDate';
      if (dateRange.repeatForever) {
        selectDateRangeOption = 'noDate';
      } else if (dateRange.repeatInstances) {
        selectDateRangeOption = 'endAfter';
      } else if (dateRange.windowEnd) {
        selectDateRangeOption = 'endDate';
      }


      console.log(selectDateRangeOption, new Date(moment(dateRange.windowEnd).format('YYYY/MM/DD')));
      // weekday patern
      this.setState({
        weeklySunday: weeklyPatern.su,
        weeklyMonday: weeklyPatern.mo,
        weekklyTuesday: weeklyPatern.tu,
        weekklyWednesday: weeklyPatern.we,
        weekklyThursday: weeklyPatern.th,
        weeklyFriday: weeklyPatern.fr,
        weeklySaturday: weeklyPatern.sa,
        selectPatern: weeklyPatern.weekFrequency,
        numberOfWeeks: weeklyPatern.weekFrequency ? weeklyPatern.weekFrequency : '1',
        selectdateRangeOption: selectDateRangeOption,
        numberOcurrences: dateRange.repeatInstances ? dateRange.repeatInstances : '1',
        disableNumberOcurrences: dateRange.repeatInstances ? false : true,
        endDate: dateRange.windowEnd ? new Date(moment(dateRange.windowEnd).format('YYYY/MM/DD')) : this.state.endDate,
        disableEndDate: dateRange.windowEnd ? false : true,
        isLoading: false,
      });

    }
    await this.applyRecurrence().catch((e: any) => console.log(e));
  }

  /**
   * Button click to apply the reccurence
   * @param ev the event
   */
  private async onApplyRecurrence(ev: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    await this.applyRecurrence().catch((e: any) => console.log(e));
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
        selectDateRangeOption = `<repeatInstances>${this.state.numberOcurrences.trim()}</repeatInstances>`;
        break;
      case 'endDate':
        selectDateRangeOption = `<windowEnd>${endDate}</windowEnd>`;
        break;
      default:
        break;
    }

    // test weekDays
    let weekdays: string = '';
    if (this.state.weeklySunday) {
      weekdays = 'su="TRUE" ';
    }
    if (this.state.weeklyMonday) {
      weekdays = `${weekdays} mo="TRUE"`;
    }
    if (this.state.weekklyTuesday) {
      weekdays = `${weekdays} tu="TRUE"`;
    }
    if (this.state.weekklyWednesday) {
      weekdays = `${weekdays} we="TRUE"`;
    }
    if (this.state.weekklyThursday) {
      weekdays = `${weekdays} th="TRUE"`;
    }
    if (this.state.weeklyFriday) {
      weekdays = `${weekdays} fr="TRUE"`;
    }
    if (this.state.weeklySaturday) {
      weekdays = `${weekdays} sa="TRUE"`;
    }
    const recurrenceXML = `<recurrence><rule><firstDayOfWeek>su</firstDayOfWeek><repeat>` +
      `<weekly ${weekdays} weekFrequency="${this.state.numberOfWeeks.trim()}" /></repeat>${selectDateRangeOption}</rule></recurrence>`;
    console.log(recurrenceXML);
    this.props.returnRecurrenceData(this.state.startDate, recurrenceXML);
  }

  /**
   * Change of checkbox input for Sunday
   * @param ev event
   * @param isChecked is the checkbox checked?
   */
  private async onCheckboxSundayChange(ev: React.FormEvent<HTMLElement>, isChecked: boolean): Promise<void> {
    this.setState({ weeklySunday: isChecked });
    await this.applyRecurrence().catch((e: any) => console.log(e));
  }

  /**
   * Change of checkbox input for Monday
   * @param ev event
   * @param isChecked is the checkbox checked?
   */
  private async onCheckboxMondayChange(ev: React.FormEvent<HTMLElement>, isChecked: boolean): Promise<void> {
    this.setState({ weeklyMonday: isChecked });
    await this.applyRecurrence().catch((e: any) => console.log(e));
  }

  /**
   * Change of checkbox input for Tuesday
   * @param ev event
   * @param isChecked is the checkbox checked?
   */
  private async onCheckboxTuesdayChange(ev: React.FormEvent<HTMLElement>, isChecked: boolean): Promise<void> {
    this.setState({ weekklyTuesday: isChecked });
    await this.applyRecurrence().catch((e: any) => console.log(e));
  }

  /**
   * Change of checkbox input for Wednesday
   * @param ev event
   * @param isChecked is the checkbox checked?
   */
  private async onCheckboxWednesdayChange(ev: React.FormEvent<HTMLElement>, isChecked: boolean): Promise<void> {
    this.setState({ weekklyWednesday: isChecked });
    await this.applyRecurrence().catch((e: any) => console.log(e));
  }

  /**
   * Change of checkbox input for Thursday
   * @param ev event
   * @param isChecked is the checkbox checked?
   */
  private async onCheckboxThursdayChange(ev: React.FormEvent<HTMLElement>, isChecked: boolean): Promise<void> {
    this.setState({ weekklyThursday: isChecked });
    await this.applyRecurrence().catch((e: any) => console.log(e));
  }

  /**
   * Change of checkbox input for Friday
   * @param ev event
   * @param isChecked is the checkbox checked?
   */
  private async onCheckboxFridayChange(ev: React.FormEvent<HTMLElement>, isChecked: boolean): Promise<void> {
    this.setState({ weeklyFriday: isChecked });
    await this.applyRecurrence().catch((e: any) => console.log(e));
  }

  /**
   * Change of checkbox input for Saturday
   * @param ev event
   * @param isChecked is the checkbox checked?
   */
  private async onCheckboxSaturdayChange(ev: React.FormEvent<HTMLElement>, isChecked: boolean): Promise<void> {
    this.setState({ weeklySaturday: isChecked });
    await this.applyRecurrence().catch((e: any) => console.log(e));
  }
  
  /**
   * The render
   * @returns JSX element
   */
  public render(): React.ReactElement<IEventRecurrenceInfoWeeklyProps> {
    return (
      <div >
        {
          <div>
            <div style={{ display: 'inline-block', float: 'right', paddingTop: '10px', height: '40px' }} />
            <div style={{ width: '100%', paddingTop: '10px' }}>
              <Label>{strings.PaternLabel}</Label>
              <div>
                <Label styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '40px' } }}>{strings.every}</Label>
                <MaskedTextField
                  styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '100px', paddingLeft: '5px' } }}
                  mask="999"
                  maskChar=' '
                  errorMessage={this.state.errorMessageNumberOfWeeks}
                  value={this.state.numberOfWeeks}
                  onChange={this.onNumberOfWeeksChange} />
                <Label styles={{ root: { display: 'inline-block', verticalAlign: 'top', width: '80px', paddingLeft: '10px' } }}>{strings.WeeksOnLabel}</Label>

              </div>
              <div style={{ marginTop: '10px' }}>
                <Checkbox label="Sunday" className={styles.ckeckBoxInline} checked={this.state.weeklySunday} onChange={this.onCheckboxSundayChange} />
                <Checkbox label="Monday" className={styles.ckeckBoxInline} checked={this.state.weeklyMonday} onChange={this.onCheckboxMondayChange} />
                <Checkbox label="Tuesday" className={styles.ckeckBoxInline} checked={this.state.weekklyTuesday} onChange={this.onCheckboxTuesdayChange} />
                <Checkbox label="Wednesday" className={styles.ckeckBoxInline} checked={this.state.weekklyWednesday} onChange={this.onCheckboxWednesdayChange} />
              </div>
              <div style={{ marginTop: '10px' }}>
                <Checkbox label="Thursday" className={styles.ckeckBoxInline} checked={this.state.weekklyThursday} onChange={this.onCheckboxThursdayChange} />
                <Checkbox label="Friday" className={styles.ckeckBoxInline} checked={this.state.weeklyFriday} onChange={this.onCheckboxFridayChange} />
                <Checkbox label="Saturday" className={styles.ckeckBoxInline} checked={this.state.weeklySaturday} onChange={this.onCheckboxSaturdayChange} />
              </div>
            </div>

            <div style={{ paddingTop: '22px' }}>
              <Label>{strings.dateRangeLabel}</Label>
              <div className={styles.dateRange}>

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
                              ariaLabel={strings.StartDatePlaceHolder}
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
                              onChange={this.onNumberOfOcurrencesChange} />
                            <Label styles={{ root: { display: 'inline-block', verticalAlign: 'top', paddingLeft: '10px' } }}>{strings.OcurrencesLabel}</Label>
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