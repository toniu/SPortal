/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
import * as React from 'react';
import { IPollAppProps } from './IPollAppProps';
/* Icons */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons"
import { faFilter } from "@fortawesome/free-solid-svg-icons"
import { faSquarePollVertical } from "@fortawesome/free-solid-svg-icons"


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
      <div className="p-2 m-2 bg-gray-300">
        <div className="block">
          <div className="py-2 bg-gray-200 border-t-4 border-black rounded-b-lg">
            <div className="flex">
              <h2 className="p-2"> my polls </h2>
              <button type="button" className="p-2 m-2 bg-indigo-700 text-white hover:bg-indigo-600 transition 0.2s rounded-md" >
                <FontAwesomeIcon icon={faPlusSquare} className="mx-1" />
                New poll
              </button>
              <button type="button" className="p-2 m-2 text-2xl text-black hover:text-gray-700 transition 0.2s" >
                <FontAwesomeIcon icon={faFilter} className="mx-1" />
              </button>
            </div>
            
            <div className="p-2 m-3 bg-gray-800">
              <ul className="overflow-scroll p-2">
                <li className="bg-white flex rounded p-1 text-base">
                <FontAwesomeIcon icon={faSquarePollVertical} className="mx-1 text-black" />
                Poll A
                <div className="m-1 top-0 right-0">
                  <h3> Uploaded 1h ago </h3>
                  <div className="m-1">
                  <FontAwesomeIcon icon={faSquarePollVertical} className="m-1 bg-black text-white" />
                  <FontAwesomeIcon icon={faSquarePollVertical} className="m-1 bg-indigo-700 text-white" />
                  <FontAwesomeIcon icon={faSquarePollVertical} className="m-1 bg-pink-900 text-white" />
                  </div>
                </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-200 border-t-4 border-black rounded-b-lg">
            <h2 className="p-2"> user polls </h2>
            <div className="-">
              <ul className="">
                <li> . </li>
              </ul>
            </div>
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