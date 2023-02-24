/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import { IDashboardAppProps } from './IDashboardAppProps';
/* SP/PNP imports */
import { SPFI } from '@pnp/sp';
import { getSP } from '../../../pnpjsConfig';
/* Icons */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from "@fortawesome/free-solid-svg-icons"

export default class DashboardApp extends React.Component<IDashboardAppProps, {}> {
  private _sp:SPFI;
  private recentEvents: any = null;
  private upcomingEvents: any = null;

  constructor(props: IDashboardAppProps) {
    super(props);
    /* Get context of SP */
    this._sp = getSP(props.context);
  }

  /* Get events from SP Lists */
  private getAllEvents = async () => {
    try {
      /* Recreate list, columns are messed up at the moment */
      /* Get list of all events; ordered by date */
      const events: any[] = await this._sp.web.lists.getByTitle("Events").items.select().orderBy("field_3", true)();
      console.log("SUCCESS: ", events);

      const today = new Date().getTime();

      /* Filtered list of 3 events max. past today's date */
      let eventsBefore = events.filter(event => Date.parse(event.field_3) < today);
      eventsBefore = eventsBefore.slice(0, 3)
      console.log('EA', eventsBefore)

      /* Filtered list of 3 events max. after today's date */
      let eventsAfter = events.filter(event => Date.parse(event.field_3) >= today);
      eventsAfter = eventsAfter.slice(Math.max(eventsAfter.length - 3, 0))
      console.log('EA', eventsAfter)
      /* Format the dates of the recent and upcoming events */
      for (let i = 0; i < eventsBefore.length; i++) {
        eventsBefore[i].field_3 = new Date(Date.parse(eventsBefore[i].field_3))
      }
      for (let i = 0; i < eventsAfter.length; i++) {
        eventsAfter[i].field_3 = new Date(Date.parse(eventsAfter[i].field_3))
      }
       /* Use filtered lists to render recent meetings and upcoming meetings */
      this.recentEvents = this.renderRecentEvents(eventsBefore);
      this.upcomingEvents = this.renderUpcomingEvents(eventsAfter);
      /* Re-render based on recent and upcoming events gathered */
      this.forceUpdate()

    } catch (e) {
      console.error("ERROR: ", e);
    }
  }

  public getRecentPoll() {
    return;
  }

  public renderRecentEvents(events: any) {
    const recentEvents = events.map((e: any) => <li key={e.ID} className="p-2 m-1 block border-l-4 border-black bg-white">
    Hosted by <span className="font-bold"> {e.field_4},</span> <span className="block font-normal">
    {e.field_3.toLocaleDateString()}
      <span className="font-semibold"> {e.field_3.toLocaleTimeString()} </span>
    </span>
  </li>)
    return recentEvents;
  }

  public renderUpcomingEvents(events: any) {
    const upcomingEvents = events.map((e: any) => <div key={e.ID} className="m-1 w-1/3 text-sm">
    <h3 className="p-1 uppercase text-white text-center font-semibold bg-gray-900">
    {e.field_3.toLocaleDateString()}
    </h3>
    <div className="p-2 block text-center bg-white">
      <span className="p-2 my-1"> {e.field_1},</span>
      <span className="block p-2 font-semibold"> {e.field_3.toLocaleTimeString()} </span>
    </div>
  </div>)
    return upcomingEvents;
  }

  public async componentDidMount(): Promise<void> {
    await this.getAllEvents();
  }

  public render(): React.ReactElement<IDashboardAppProps> {
    return (
      <div className="p-1 m-1">
      <div className="top-section p-1 m-1 flex">
        <div className="p-1 m-1 w-2/5 bg-gray-300 border-t-4 border-indigo-600">
          <h2 className="p-2 text-black font-semibold text-lg">
            recent meetings
          </h2>
          <ul className="p-2">
            {this.recentEvents}
          </ul>
        </div>
        <div className="p-1 m-1 w-3/5 bg-gray-300 border-t-4 border-indigo-600">
          <h2 className="p-2 text-black font-semibold text-lg">
            upcoming events
          </h2>
          <div className="p-1 flex">
            {this.upcomingEvents}
          </div>
          <br/>
          <button type="button" className="px-3 py-1 mx-4 block float-right text-normal bg-indigo-900 rounded-full text-white hover:bg-indigo-600 transition 0.2s">
            See more events...
          </button>
        </div>
      </div>
      <div className="bottom-section p-1 m-1 flex">
        <div className="p-1 m-1 w-3/5 bg-gray-300 border-t-4 border-indigo-600">
          <h2 className="p-2 text-black font-semibold text-lg">
            recent documents
          </h2>
          <div className="flex p-1 m-1">
            <div className="p-1 w-1/3">
              <div className="p-4 bg-gray-800 text-white text-center ">
              <FontAwesomeIcon icon={faFile} className="mx-1 text-4xl" />
              </div>
              <div className="p-2 text-black bg-white text-center">
              staffupload.docx <span className="block p-1 font-semibold text-xs">
                Uploaded 1h ago
                </span>
              </div>
            </div>
            <div className="p-1 w-1/3">
              <div className="p-4 bg-gray-800 text-white text-center ">
              <FontAwesomeIcon icon={faFile} className="mx-1 text-4xl" />
              </div>
              <div className="p-2 text-black bg-white text-center">
              staffupload.docx <span className="block p-1 font-semibold text-xs">
                Uploaded 1h ago
                </span>
              </div>
            </div>
            <div className="p-1 w-1/3">
              <div className="p-4 bg-gray-800 text-white text-center ">
              <FontAwesomeIcon icon={faFile} className="mx-1 text-4xl" />
              </div>
              <div className="p-2 text-black bg-white text-center">
              staffupload.docx <span className="block p-1 font-semibold text-xs">
                Uploaded 1h ago
                </span>
              </div>
            </div>
          </div>
          <br/>
          <button type="button" className="px-3 py-1 m-2 block float-right text-normal bg-indigo-900 rounded-full text-white hover:bg-indigo-600 transition 0.2s">
            See more documents...
          </button>
        </div>
        <div className="p-1 m-1 w-2/5 bg-gray-300 border-t-4 border-indigo-600">
          <h2 className="p-2 text-black font-semibold text-lg">
            recent polls
          </h2>
          <div className="poll-question p-1 m-1">
            <h3 className="p-1 font-semibold text-black"> Poll Question #549 </h3>
            <div className="question p-1 text-black font-normal">
              From the previous meeting discussing which option is the most feasible?
            </div>
            <div className="poll-answers p-2 m-1 bg-gray-800 rounded-lg">
              <button type="button" className="block my-1 px-3 py-1 w-full text-black bg-indigo-300 hover:bg-indigo-400 rounded-full transition 0.2s">
                Option A
              </button>
              <button type="button" className="block my-1 px-3 py-1 w-full text-black bg-indigo-300 hover:bg-indigo-400 rounded-full transition 0.2s">
                Option B
              </button>
              <button type="button" className="block my-1 px-3 py-1 w-full text-black bg-indigo-300 hover:bg-indigo-400 rounded-full transition 0.2s">
                Option C
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}
