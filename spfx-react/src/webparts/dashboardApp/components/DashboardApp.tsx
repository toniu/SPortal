/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import { IDashboardAppProps } from './IDashboardAppProps';
import { IDashboardAppState } from './IDashboardAppState';
/* Services */
import UserEventService from '../../../services/UserEventService';
import { IEventData } from '../../calendar/models/IEventData';

import { escape } from '@microsoft/sp-lodash-subset';
/* Icons */
import { Icon } from 'office-ui-fabric-react/lib/Icon';
/**
 * The main component of the Dashboard web part
 */
export default class DashboardApp extends React.Component<IDashboardAppProps, IDashboardAppState> {
  private recentEvents: any = null;
  private upcomingEvents: any = null;

  constructor(props: IDashboardAppProps) {
    super(props);

    this.state = {
      eventData: [],
      currentUserData: null,
      hasError: false,
      isLoading: true,
      recentEvents: [],
      upcomingEvents: []
    }

    /* Get the current user information */
    this.getCurrentUser().catch((e: any) => console.log(e))
  }

  private async getCurrentUser(): Promise<void> {
    const userInfo = await UserEventService.getCurrentUserInfo();
    this.setState({ currentUserData: userInfo })
    this.forceUpdate()
  }

  private async loadEvents(): Promise<void> {
    try {
      // Teste Properties
      if (!this.props.list || !this.props.siteUrl || !this.props.eventStartDate.value || !this.props.eventEndDate.value) return;

      const eventsData: IEventData[] = await UserEventService.getEvents(escape(this.props.siteUrl), escape(this.props.list), this.props.eventStartDate.value, this.props.eventEndDate.value);
      console.log('Events data:', eventsData);

      const today = new Date().getTime();
      let eventsBefore = eventsData.filter((event: any) => Date.parse(event.EventDate) < today);
      eventsBefore = eventsBefore.slice(0, 3)
      console.log('EB', eventsBefore)

      /* Filtered list of 3 events max. after today's date */
      let eventsAfter: any = eventsData.filter((event: any) => Date.parse(event.EventDate) >= today);
      eventsAfter = eventsAfter.slice(Math.max(eventsAfter.length - 3, 0))
      console.log('EA', eventsAfter)

      /* Use filtered lists to render recent meetings and upcoming meetings */
      this.recentEvents = this.renderRecentEvents(eventsBefore);
      this.upcomingEvents = this.renderUpcomingEvents(eventsAfter);
      /* Re-render based on recent and upcoming events gathered */
      this.forceUpdate()

      this.setState({ eventData: eventsData, hasError: false, recentEvents: eventsBefore, upcomingEvents: eventsAfter });
    } catch (e) {
      this.setState({ eventData: [], hasError: true })
    }

  }

  /**
   * Render the recent events
   * @param events the events
   * @returns JSX element of renders events
   */
  public renderRecentEvents(events: any) {
    const recentEvents = events.map((e: any) => <li key={e.ID} className="p-2 m-1 block border-l-4 border-black bg-white shadow-lg">
      <span className="block"> {e.title} </span>
      <span className="block">  Hosted by <span className="font-bold"> {e.ownerName},</span> <span className="block font-normal">
        {e.EventDate.toLocaleDateString()}  <span className="font-semibold"> {e.EventDate.toLocaleTimeString()} </span> </span>
      </span>
    </li>)
    return recentEvents;
  }

  /**
  * Render the upcoming events
  * @param events the events
  * @returns JSX element of renders events
  */
  public renderUpcomingEvents(events: any) {
    const upcomingEvents = events.map((e: any) => <div key={e.ID} className="m-1 w-1/3 text-sm shadow-lg">

      <h3 className="p-1 uppercase text-white text-center font-semibold bg-gray-900">
        {e.EventDate.toLocaleDateString()}
      </h3>
      <div className="p-2 block text-center bg-white">
        <span className="p-1 block text-center font-semibold">
          {e.title}
        </span>
        <span className="p-2 block my-1"> {e.ownerName},</span>
        <span className="block p-2 font-semibold"> {e.EventDate.toLocaleTimeString()} </span>
      </div>
    </div>)
    return upcomingEvents;
  }

  /**
   * Load the events when the component mounts
   */
  public async componentDidMount(): Promise<void> {
    this.setState({ isLoading: true });
    await this.loadEvents();
    this.setState({ isLoading: false });
  }

  public async componentDidUpdate(prevProps: IDashboardAppProps): Promise<void> {

    if (!this.props.list || !this.props.siteUrl || !this.props.eventStartDate.value || !this.props.eventEndDate.value) return;
    // Get  Properties change
    if (prevProps.list !== this.props.list || this.props.eventStartDate.value !== prevProps.eventStartDate.value || this.props.eventEndDate.value !== prevProps.eventEndDate.value) {
      this.setState({ isLoading: true });
      await this.loadEvents();
      this.setState({ isLoading: false });
    }
  }

  /**
   * The render
   * @returns the rendered component
   */
  public render(): React.ReactElement<IDashboardAppProps> {
    const { currentUserData } = this.state
    return (
      <div className="p-1 m-1">
        {
          currentUserData !== null && currentUserData !== undefined &&
          <div className="top-section p-3 m-1 flex bg-gray-900 text-white text-lg">
            <Icon className="mx-2 text-lg font-bold" iconName='Contact' />
            Welcome&nbsp;<span className="font-bold"> {currentUserData.DisplayName} </span>
          </div>
        }
        <div className="bottom-section p-1 m-1">
          <div className="p-1 m-1 w-full bg-gray-100 border-t-4 border-cyan-700">
            <h2 className="p-2 text-black font-semibold text-lg">
              recent meetings
            </h2>
            {
              this.state.recentEvents.length > 0 && <ul className="p-1">
                {this.recentEvents}
              </ul>
            }
            {
              this.state.recentEvents.length === 0 &&
              <div className="p-2 font-semibold text-gray-700 flex">
                 <Icon className="mx-3" iconName='Event' />
                There are no recent meetings...
              </div>
            }

          </div>
          <div className="p-1 m-1 w-full bg-gray-100 border-t-4 border-cyan-700">
            <h2 className="p-2 text-black font-semibold text-lg">
              upcoming events
            </h2>
            {
              this.state.upcomingEvents.length > 0 && <div className="p-1 flex">
                {this.upcomingEvents}
              </div>
            }
            {
              this.state.upcomingEvents.length === 0 &&
              <div className="p-2 font-semibold text-gray-700 flex">
                <Icon className="mx-3" iconName='Event' />
                There are no upcoming meetings...
              </div>
            }
            <br/>
          </div>
        </div>
      </div>
    );
  }
}
