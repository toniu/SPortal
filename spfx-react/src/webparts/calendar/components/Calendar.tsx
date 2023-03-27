/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import styles from './Calendar.module.scss';
import { ICalendarProps } from './ICalendarProps';
import { ICalendarState } from './ICalendarState';
import { escape } from '@microsoft/sp-lodash-subset';
import * as moment from 'moment';
import * as strings from 'CalendarWebPartStrings';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Year from './Year/Year';

import { Calendar as MyCalendar, momentLocalizer } from 'react-big-calendar';

import {
  Customizer,
  IPersonaSharedProps,
  Persona,
  PersonaSize,
  PersonaPresence,
  HoverCard, HoverCardType,
  DocumentCard,
  DocumentCardActivity,
  DocumentCardDetails,
  DocumentCardPreview,
  DocumentCardTitle,
  IDocumentCardPreviewProps,
  Icon,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,


} from 'office-ui-fabric-react';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { DisplayMode } from '@microsoft/sp-core-library';
import UserEventService from '../../../services/UserEventService';
import { Event } from '../controls/Event/Event';
import { IPanelModelEnum } from '../controls/Event/IPanelModeEnum';
import { IEventData } from './../models/IEventData';
import { IUserPermissions } from './../models/IUserPermissions';

const localizer = momentLocalizer(moment);

/**
 * Component for the calendar
 */
export default class Calendar extends React.Component<ICalendarProps, ICalendarState> {
  private userListPermissions: IUserPermissions = undefined;

  /**
   * The constructor; initial state, binding of functions
   * @param props the props
   */
  public constructor(props: ICalendarProps) {
    super(props);

    this.state = {
      showDialog: false,
      eventData: [],
      selectedEvent: undefined,
      isloading: true,
      hasError: false,
      errorMessage: '',
    };

    this.onDismissPanel = this.onDismissPanel.bind(this);
    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.onSelectSlot = this.onSelectSlot.bind(this);

    moment.locale(this.props.context.pageContext.cultureInfo.currentUICultureName);

  }

  /**
   * Event fired for selected event; go to edit-mode
   * @param event the event to select
   */
  private onSelectEvent(event: any): void {
    this.setState({ showDialog: true, selectedEvent: event, panelMode: IPanelModelEnum.edit });
  }

  /**
   * On dismiss panel
   * @param refresh is refreshing?
   */
  private async onDismissPanel(refresh: boolean): Promise<void> {

    this.setState({ showDialog: false });
    if (refresh === true) {
      this.setState({ isloading: true });
      await this.loadEvents();
      this.setState({ isloading: false });
    }
  }


  /**
   * Loads the events of the calendar based on site URL and list (also the date range)
   * @returns 
   */
  private async loadEvents(): Promise<void> {
    try {
      // Teste Properties
      if (!this.props.list || !this.props.siteUrl || !this.props.eventStartDate.value || !this.props.eventEndDate.value) return;

      this.userListPermissions = await UserEventService.getUserPermissions(this.props.siteUrl, this.props.list);

      const eventsData: IEventData[] = await UserEventService.getEvents(escape(this.props.siteUrl), escape(this.props.list), this.props.eventStartDate.value, this.props.eventEndDate.value);

      this.setState({ eventData: eventsData, hasError: false, errorMessage: "" });
    } catch (error) {
      this.setState({ hasError: true, errorMessage: error.message, isloading: false });
    }
  }

  /**
   * When component is mounted, load events
   */
  public async componentDidMount(): Promise<void> {
    this.setState({ isloading: true });
    await this.loadEvents();
    this.setState({ isloading: false });
  }

  /**
   * When component catches an error, present error message
   * @param error the error
   * @param errorInfo the information on the error
   */
  public componentDidCatch(error: any, errorInfo: any): void {
    this.setState({ hasError: true, errorMessage: errorInfo.componentStack });
  }

  /**
   * When the component updated, get changes to the properties, and re-load events
   * @param prevProps the previous props
   * @param prevState the previous state
   * @returns 
   */
  public async componentDidUpdate(prevProps: ICalendarProps, prevState: ICalendarState): Promise<void> {

    if (!this.props.list || !this.props.siteUrl || !this.props.eventStartDate.value || !this.props.eventEndDate.value) return;
    // Get  Properties change
    if (prevProps.list !== this.props.list || this.props.eventStartDate.value !== prevProps.eventStartDate.value || this.props.eventEndDate.value !== prevProps.eventEndDate.value) {
      this.setState({ isloading: true });
      await this.loadEvents();
      this.setState({ isloading: false });
    }
  }

  /**
   * Renders the event
   * @param event The data of the event
   * @returns JSX element
   */
  private renderEvent(event: IEventData): JSX.Element {

    const previewEventIcon: IDocumentCardPreviewProps = {
      previewImages: [
        {
          // previewImageSrc: event.ownerPhoto,
          previewIconProps: { iconName: event.fRecurrence === '0' ? 'Calendar' : 'RecurringEvent', styles: { root: { color: event.color } }, className: styles.previewEventIcon },
          height: 43,
        }
      ]
    };
    const EventInfo: IPersonaSharedProps = {
      imageInitials: event.ownerInitial,
      imageUrl: event.ownerPhoto,
      text: event.title
    };

    /**
     * @returns {JSX.Element}
     */
    const onRenderPlainCard = (): JSX.Element => {
      return (
        <div className={styles.plainCard}>
          <DocumentCard className={styles.Documentcard}   >
            <div>
              <DocumentCardPreview {...previewEventIcon} />
            </div>
            <DocumentCardDetails>
              <div className={styles.DocumentCardDetails}>
                <DocumentCardTitle title={event.title} shouldTruncate={true} className={styles.DocumentCardTitle} styles={{ root: { color: event.color } }} />
              </div>
              {
                moment(event.EventDate).format('YYYY/MM/DD') !== moment(event.EndDate).format('YYYY/MM/DD') ?
                  <span className={styles.DocumentCardTitleTime}>{moment(event.EventDate).format('dddd')} - {moment(event.EndDate).format('dddd')} </span>
                  :
                  <span className={styles.DocumentCardTitleTime}>{moment(event.EventDate).format('dddd')} </span>
              }
              <span className={styles.DocumentCardTitleTime}>{moment(event.EventDate).format('HH:mm')}H - {moment(event.EndDate).format('HH:mm')}H</span>
              <Icon iconName='MapPin' className={styles.locationIcon} style={{ color: event.color }} />
              <DocumentCardTitle
                title={`${event.location}`}
                shouldTruncate={true}
                showAsSecondaryTitle={true}
                className={styles.location}
              />
              <div style={{ marginTop: 20 }}>
                <DocumentCardActivity
                  activity={strings.EventOwnerLabel}
                  people={[{ name: event.ownerName, profileImageSrc: event.ownerPhoto, initialsColor: event.color }]}
                />
              </div>
            </DocumentCardDetails>
          </DocumentCard>
        </div>
      );
    };

    return (
      <div style={{ height: 22 }}>
        <HoverCard
          cardDismissDelay={1000}
          type={HoverCardType.plain}
          plainCardProps={{ onRenderPlainCard: onRenderPlainCard }}
        >
          <Persona
            {...EventInfo}
            size={PersonaSize.size24}
            presence={PersonaPresence.none}
            coinSize={22}
            initialsColor={event.color}
          />
        </HoverCard>
      </div>
    );
  }

  /**
   * On configure; opens the property pane
   */
  private onConfigure(): void {
    /* Context of the web part */
    this.props.context.propertyPane.open();
  }


  /**
   * The selected slot; range of start and end; panel set to add mode
   * @param param0 The start and end
   * @returns 
   */
  public onSelectSlot({ start, end }: { start: any, end: any }): void {
    if (!this.userListPermissions.hasPermissionAdd) return;
    this.setState({ showDialog: true, startDateSlot: start, endDateSlot: end, selectedEvent: undefined, panelMode: IPanelModelEnum.add });
  }

  /**
   * Style the selected event
   * @param event the event
   * @param _start start
   * @param _end end
   * @param _isSelected is it selected?
   * @returns the style
   */
  public eventStyleGetter(event: any, _start: any, _end: any, _isSelected: any): any {

    const style: any = {
      backgroundColor: 'white',
      borderRadius: '0px',
      opacity: 1,
      color: event.color,
      borderWidth: '1.1px',
      borderStyle: 'solid',
      borderColor: event.color,
      borderLeftWidth: '6px',
      display: 'block'
    };

    return {
      style: style
    };
  }


  /**
   * Gets the day properties
   * @param date the date
   * @returns style of day prop getter
   */
  public dayPropGetter(date: Date): any {
    return {
      className: styles.dayPropGetter
    };
  }

  /**
   * The render
   * @returns The JSX element
   */
  public render(): React.ReactElement<ICalendarProps> {

    return (
      <Customizer>


        <div className={styles.calendar} style={{ backgroundColor: 'white', padding: '20px' }}>
          <WebPartTitle displayMode={this.props.displayMode}
            title={this.props.title}
            updateProperty={this.props.updateProperty} />
          {
            (!this.props.list || !this.props.eventStartDate.value || !this.props.eventEndDate.value) ?
              <Placeholder iconName='Edit'
                iconText={strings.WebpartConfigIconText}
                description={strings.WebpartConfigDescription}
                buttonLabel={strings.WebPartConfigButtonLabel}
                hideButton={this.props.displayMode === DisplayMode.Read}
                onConfigure={this.onConfigure.bind(this)} />
              :
              // test if has errors
              this.state.hasError ?
                <MessageBar messageBarType={MessageBarType.error}>
                  {this.state.errorMessage}
                </MessageBar>
                :
                // show Calendar
                // Test if is loading Events
                <div>
                  {this.state.isloading ? <Spinner size={SpinnerSize.large} label={strings.LoadingEventsLabel} /> :
                    <div className={styles.container}>
                      <MyCalendar
                        dayPropGetter={this.dayPropGetter}
                        localizer={localizer}
                        selectable
                        events={this.state.eventData}
                        startAccessor="EventDate"
                        endAccessor="EndDate"
                        eventPropGetter={this.eventStyleGetter}
                        onSelectSlot={this.onSelectSlot}
                        components={{ event: this.renderEvent } as any}
                        onSelectEvent={this.onSelectEvent}
                        defaultDate={moment().startOf('day').toDate()}
                        views={{
                          day: true,
                          week: true,
                          month: true,
                          agenda: true,
                          work_week: Year
                        }}
                        messages={
                          {
                            'today': strings.todayLabel,
                            'previous': strings.previousLabel,
                            'next': strings.nextLabel,
                            'month': strings.monthLabel,
                            'week': strings.weekLabel,
                            'day': strings.dayLable,
                            'showMore': total => `+${total} ${strings.showMore}`,
                            'work_week': strings.yearHeaderLabel
                          }
                        }
                      />
                    </div>
                  }
                </div>
          }
          {
            this.state.showDialog &&
            <Event
              event={this.state.selectedEvent}
              panelMode={this.state.panelMode}
              onDissmissPanel={this.onDismissPanel}
              showPanel={this.state.showDialog}
              startDate={this.state.startDateSlot}
              endDate={this.state.endDateSlot}
              context={this.props.context}
              siteUrl={this.props.siteUrl}
              listId={this.props.list}
            />
          }
        </div>
      </Customizer>
    );
  }
}