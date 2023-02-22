/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import { IDashboardAppProps } from './IDashboardAppProps';
/* Icons */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from "@fortawesome/free-solid-svg-icons"

export default class DashboardApp extends React.Component<IDashboardAppProps, {}> {
  public getEventsData() {
    console.log("hey")
    return true;
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
            <li className="p-2 m-1 block border-l-4 border-black bg-white">
              Hosted by <span className="font-bold"> J.Turner,</span> <span className="block font-normal">
                16/12/22
                <span className="font-semibold"> 17:00 </span>
              </span>
            </li>
            <li className="p-2 m-1 block border-l-4 border-black bg-white">
              Hosted by <span className="font-bold"> D.Micheals,</span> <span className="block font-normal">
                18/12/22
                <span className="font-semibold"> 17:00 </span>
              </span>
            </li>
            <li className="p-2 m-1 block border-l-4 border-black bg-white">
              Hosted by <span className="font-bold"> T.Andrews,</span> <span className="block font-normal">
                23/12/22
                <span className="font-semibold"> 17:00 </span>
              </span>
            </li>
          </ul>
        </div>
        <div className="p-1 m-1 w-3/5 bg-gray-300 border-t-4 border-indigo-600">
          <h2 className="p-2 text-black font-semibold text-lg">
            upcoming events
          </h2>
          <div className="p-1 flex">
            <div className="m-1 w-1/3 text-sm">
              <h3 className="p-1 uppercase text-white text-center font-semibold bg-gray-900">
                Mon 21 Nov
              </h3>
              <div className="p-2 block text-center bg-white">
                <span className="p-2 my-1">Catch-up meeting,</span>
                <span className="block p-2 font-semibold"> 10:30 </span>
              </div>
            </div>
            <div className="m-1 w-1/3 text-sm">
              <h3 className="p-1 uppercase text-white text-center font-semibold bg-gray-900">
                Tue 22 Nov
              </h3>
              <div className="p-2 block text-center bg-white">
                <span className="p-2 my-1">Audit meeting,</span>
                <span className="block p-2 font-semibold"> 10:30 </span>
              </div>
            </div>
            <div className="m-1 w-1/3 text-sm">
              <h3 className="p-1 uppercase text-white text-center font-semibold bg-gray-900">
                Fri 25 Nov
              </h3>
              <div className="p-2 block text-center bg-white">
                <span className="p-2 my-1">End of week meeting,</span>
                <span className="block p-2 font-semibold"> 10:30 </span>
              </div>
            </div>
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
