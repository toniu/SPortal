/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
import * as React from 'react';
import { IPollAppProps } from './IPollAppProps';
/* Icons */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn, faPlusSquare } from "@fortawesome/free-solid-svg-icons"
import { faFilter } from "@fortawesome/free-solid-svg-icons"
import { faSquarePollVertical } from "@fortawesome/free-solid-svg-icons"
import { faInfo } from "@fortawesome/free-solid-svg-icons"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { faUser } from "@fortawesome/free-solid-svg-icons"


const pollQuestions = [
  {
    id: 0,
    title: 'poll1',
    question: 'What approach should we go with?',
    authorID: 1,
    options: [
      { option: 'A', votes: 0 },
      { option: 'B', votes: 0 },
      { option: 'C', votes: 0 },
      { option: 'D', votes: 0 }]
  },
  {
    id: 0,
    title: 'poll2',
    question: 'What second approach should we go with?',
    authorID: 2,
    options: [
      { option: 'A', votes: 0 },
      { option: 'B', votes: 0 },
      { option: 'C', votes: 0 },
      { option: 'D', votes: 0 }]
  }
]

console.log(pollQuestions);

const PollApp = (props: IPollAppProps) => {

  /**
   * The main poll presented on the page. The user inputs this
   * @returns 
   */
  function displayPoll() {
    return (
      <div className="pollbox p-5 m-1 bg-gray-200 bg-opacity-75 border-t-4 border-black ">
        <h2 className="question text-xl font-bold">
          # Poll Title
        </h2>
        <div className="options p-2 m-2">
          <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">How much do you expect to use each month?</h3>
          <ul className="grid w-full gap-2 md:grid-cols-2">
            <li>
              <input type="radio" id="hosting-small" name="hosting" value="hosting-small" className="hidden peer" required />
              <label htmlFor="hosting-small" className="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-indigo-600 peer-checked:text-indigo-600 hover:text-gray-600 hover:bg-gray-100">
                <div className="block">
                  <div className="w-full text-base font-semibold">0-50 MB</div>
                </div>
              </label>
            </li>
            <li>
              <input type="radio" id="hosting-big" name="hosting" value="hosting-big" className="hidden peer" />
              <label htmlFor="hosting-big" className="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-indigo-600 peer-checked:text-indigo-600 hover:text-gray-600 hover:bg-gray-100">
                <div className="block">
                  <div className="w-full text-base font-semibold">500-1000 MB</div>
                </div>
              </label>
            </li>
            <li>
              <input type="radio" id="hosting-big" name="hosting" value="hosting-big" className="hidden peer" />
              <label htmlFor="hosting-big" className="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-indigo-600 peer-checked:text-indigo-600 hover:text-gray-600 hover:bg-gray-100">
                <div className="block">
                  <div className="w-full text-base font-semibold">1000-1500 MB</div>
                </div>
              </label>
            </li>
          </ul>
        </div>
        <div className="">
          <button type="submit" id="submit-poll" className="px-4 py-2 mx-2 bg-indigo-600 text-base text-white rounded-lg hover:bg-indigo-500 transition 0.5s" >submit poll</button>
        </div>
      </div>);
  }

  function submitPoll() {
    console.log("placeholder");
    /* ... */
    /* Use input from form (userID, option) to formulate */
    /* New ID created for new poll response */
    /* Use SPLists to ADD a new poll response into list "Poll responses" */
    /* Use SPLists to UPDATE (increment votes) in list "Polls" */
    /* Refresh existing polls */

    return (
      <div className="m-1">
        -
      </div>
    );

  }

  function getPolls() {
    console.log("placeholder");
    /* ... */
    /* Use SPLists to get all existing polls in "polls" */
    /* Polls owned by user vs. polls NOT owned by user */
    /* Populate data into variables which can be used for rendering */

    return (
      <div className="container p-1 flex">
        <div className="my-polls m-1 bg-gray-300 border-t-4 border-indigo-600 w-2/5">
          <div className="flow-root">
            <h1 className="p-3 float-left font-bold text-base"> my polls </h1>
            <div className="p-1 m-1 float-right">
              <button type="button" className="new-poll px-3 py-1 mx-2 rounded-full text-white font-semibold bg-indigo-800 hover:bg-indigo-600 transition 0.2s">
                <FontAwesomeIcon icon={faPlusSquare} className="mx-1" />
                new poll
              </button>
              <button type="button" className="new-poll p-1 mx-1 rounded-lg text-black text-2xl font-bold hover:text-gray-800 transition 0.2s">
                <FontAwesomeIcon icon={faFilter} className="mx-1" />
              </button>
            </div>
          </div>
          <div className="polls-box p-2 m-2 bg-black bg-opacity-75">
            <ul className="p-2 overflow-y-scroll h-48">
              <li className="p-1 m-1 bg-white flow-root">
                <div className="py-1 mx-1 text-base float-left">
                  <FontAwesomeIcon icon={faSquarePollVertical} className="mx-2 text-black text-2xl" />
                  Poll A
                </div>
                <div className="px-1 m-1 block float-right">
                  <span className="py-1 text-black text-sm font-normal">
                    Uploaded 1h ago
                  </span>
                  <div className="text-center">
                    <button type="button" className="info-poll px-2 mx-1 rounded-full text-white font-semibold bg-black hover:bg-gray-600 transition 0.2s">
                      <FontAwesomeIcon icon={faInfo} className="mx-1" />
                    </button>
                    <button type="button" className="edit-poll px-1 mx-1 rounded-full text-white font-semibold bg-indigo-900 hover:bg-indigo-600 transition 0.2s">
                      <FontAwesomeIcon icon={faPenToSquare} className="mx-1" />
                    </button>
                    <button type="button" className="delete-poll px-1 mx-1 rounded-full text-white font-semibold bg-pink-900 hover:bg-pink-600 transition 0.2s">
                      <FontAwesomeIcon icon={faTrashCan} className="mx-1" />
                    </button>
                  </div>
                </div>
              </li>
              <li className="p-1 m-1 bg-white flow-root">
                <div className="py-1 mx-1 text-base float-left">
                  <FontAwesomeIcon icon={faSquarePollVertical} className="mx-2 text-black text-2xl" />
                  Poll B
                </div>
                <div className="px-1 m-1 block float-right">
                  <span className="py-1 text-black text-sm font-normal">
                    Uploaded 3h ago
                  </span>
                  <div className="text-center">
                    <button type="button" className="info-poll px-2 mx-1 rounded-full text-white font-semibold bg-black hover:bg-gray-600 transition 0.2s">
                      <FontAwesomeIcon icon={faInfo} className="mx-1" />
                    </button>
                    <button type="button" className="edit-poll px-1 mx-1 rounded-full text-white font-semibold bg-indigo-900 hover:bg-indigo-600 transition 0.2s">
                      <FontAwesomeIcon icon={faPenToSquare} className="mx-1" />
                    </button>
                    <button type="button" className="delete-poll px-1 mx-1 rounded-full text-white font-semibold bg-pink-900 hover:bg-pink-600 transition 0.2s">
                      <FontAwesomeIcon icon={faTrashCan} className="mx-1" />
                    </button>
                  </div>
                </div>
              </li>
              <li className="p-1 m-1 bg-white flow-root">
                <div className="py-1 mx-1 text-base float-left">
                  <FontAwesomeIcon icon={faSquarePollVertical} className="mx-2 text-black text-2xl" />
                  Poll C
                </div>
                <div className="px-1 m-1 block float-right">
                  <span className="py-1 text-black text-sm font-normal">
                    Uploaded 21h ago
                  </span>
                  <div className="text-center">
                    <button type="button" className="info-poll px-2 mx-1 rounded-full text-white font-semibold bg-black hover:bg-gray-600 transition 0.2s">
                      <FontAwesomeIcon icon={faInfo} className="mx-1" />
                    </button>
                    <button type="button" className="edit-poll px-1 mx-1 rounded-full text-white font-semibold bg-indigo-900 hover:bg-indigo-600 transition 0.2s">
                      <FontAwesomeIcon icon={faPenToSquare} className="mx-1" />
                    </button>
                    <button type="button" className="delete-poll px-1 mx-1 rounded-full text-white font-semibold bg-pink-900 hover:bg-pink-600 transition 0.2s">
                      <FontAwesomeIcon icon={faTrashCan} className="mx-1" />
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="user-polls m-1 bg-gray-300 border-t-4 border-indigo-600 w-3/5">
          <div className="flow-root">
            <h1 className="p-3 float-left font-bold text-base"> user polls </h1>
            <div className="p-1 m-1 flex float-right">

              <div className="flex h-8 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
                <div className="grid place-items-center h-full w-12 text-gray-300">
                  <FontAwesomeIcon icon={faSearch} className="mx-2 text-black text-xl" />
                </div>

                <input
                  className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 focus:text-black"
                  type="text"
                  id="search" />
              </div>

              <button type="button" className="new-poll p-1 mx-1 rounded-lg text-black text-2xl font-bold hover:text-gray-800 transition 0.2s">
                <FontAwesomeIcon icon={faFilter} className="mx-1" />
              </button>
            </div>
          </div>
          <div className="polls-box p-2 m-2 bg-black bg-opacity-75">
            <ul className="p-2 overflow-y-scroll h-48">
              <li className="p-1 m-1 bg-white flow-root">
                <div className="py-1 mx-1 text-base flex float-left">
                  <FontAwesomeIcon icon={faSquarePollVertical} className="mx-2 text-black text-2xl" />
                  <div className="block">
                    <span className="p-1 mx-1 font-normal">
                      Meeting A Poll
                    </span>
                    <span className="p-1 block font-normal">
                      <FontAwesomeIcon icon={faUser} className="mx-2 text-black text-base" />
                      M.Stevens
                    </span>
                  </div>
                </div>
                <div className="px-1 m-1 block float-right">
                  <span className="py-1 text-black text-sm font-normal">
                    Uploaded 1h ago
                  </span>
                  <div className="text-center">
                    <button type="button" className="info-poll px-2 mx-1 rounded-full text-white font-semibold bg-black hover:bg-gray-600 transition 0.2s">
                      <FontAwesomeIcon icon={faChartColumn} className="mx-1" />
                    </button>
                    <button type="button" className="delete-poll px-1 mx-1 rounded-full text-white font-semibold bg-pink-900 hover:bg-pink-600 transition 0.2s">
                      <FontAwesomeIcon icon={faTrashCan} className="mx-2" />
                    </button>
                  </div>
                </div>
              </li>
              <li className="p-1 m-1 bg-white flow-root">
                <div className="py-1 mx-1 text-base flex float-left">
                  <FontAwesomeIcon icon={faSquarePollVertical} className="mx-2 text-black text-2xl" />
                  <div className="block">
                    <span className="p-1 mx-1 font-normal">
                      Meeting B Poll
                    </span>
                    <span className="p-1 block font-normal">
                      <FontAwesomeIcon icon={faUser} className="mx-2 text-black text-base" />
                      P.Tucker
                    </span>
                  </div>
                </div>
                <div className="px-1 m-1 block float-right">
                  <span className="py-1 text-black text-sm font-normal">
                    Uploaded 1h ago
                  </span>
                  <div className="text-center">
                    <button type="button" className="info-poll px-2 mx-1 rounded-full text-white font-semibold bg-black hover:bg-gray-600 transition 0.2s">
                      <FontAwesomeIcon icon={faChartColumn} className="mx-1" />
                    </button>
                    <button type="button" className="delete-poll px-1 mx-1 rounded-full text-white font-semibold bg-pink-900 hover:bg-pink-600 transition 0.2s">
                      <FontAwesomeIcon icon={faTrashCan} className="mx-2" />
                    </button>
                  </div>
                </div>
              </li>
              <li className="p-1 m-1 bg-white flow-root">
                <div className="py-1 mx-1 text-base flex float-left">
                  <FontAwesomeIcon icon={faSquarePollVertical} className="mx-2 text-black text-2xl" />
                  <div className="block">
                    <span className="p-1 mx-1 font-normal">
                      Meeting C Poll
                    </span>
                    <span className="p-1 block font-normal">
                      <FontAwesomeIcon icon={faUser} className="mx-2 text-black text-base" />
                      D.Andrews
                    </span>
                  </div>
                </div>
                <div className="px-1 m-1 block float-right">
                  <span className="py-1 text-black text-sm font-normal">
                    Uploaded 1h ago
                  </span>
                  <div className="text-center">
                    <button type="button" className="info-poll px-2 mx-1 rounded-full text-white font-semibold bg-black hover:bg-gray-600 transition 0.2s">
                      <FontAwesomeIcon icon={faChartColumn} className="mx-1" />
                    </button>
                    <button type="button" className="delete-poll px-1 mx-1 rounded-full text-white font-semibold bg-pink-900 hover:bg-pink-600 transition 0.2s">
                      <FontAwesomeIcon icon={faTrashCan} className="mx-2" />
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  function addPoll() {
    console.log("placeholder");
    /* ... */
    /* Use input from form (the selected option) to formulate */
    /* Input of poll:  */
    /* Use SPLists to add a new poll into list "Polls" */
    /* Refresh existing polls */

    return (
      <div className="m-1">
        -
      </div>
    );
  }

  function selectPoll() {
    console.log("placeholder");
    /* Retrieve the ID of the selected poll */
    /* Use poll's ID to present the relevant metadata */
    /* Alternative views: VIEW or EDIT depending on if the poll was owned by the logged in user */

    return (
      <div className="m-1">
        -
      </div>
    );
  }

  function deletePoll() {
    console.log("placeholder");

    /* ... */
    /* Use SPlists to delete poll from "Polls" list using selected poll ID */
    /* Refresh existing polls */

    return (
      <div className="m-1">
        -
      </div>
    );
  }

  displayPoll();
  submitPoll();
  addPoll();
  selectPoll();
  getPolls();
  deletePoll();

  return (
    getPolls()
  );
}

export default PollApp