/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import { IProfileProps } from './IProfileProps';
/* Icons */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { faUserGroup } from "@fortawesome/free-solid-svg-icons"
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons"


/* ... Function plans (temp) */
/* getProfileInfo(ID): to get name, and other information etc. */
/* getAllStudents(ID): get IDs and randomly select some to present to "discover more" */
const Profile = (props: IProfileProps) => {
  return (
    <div className="container p-1 flex">
      <div className="profile-box m-1 bg-gray-300 border-t-4 border-indigo-600 w-3/5">
        <div className="topbar flex p-3 bg-gray-800 bg-opacity-75">
          <FontAwesomeIcon icon={faUser} className="p-3 bg-gray-700 text-3xl rounded-full text-white border-white border-4" />
          <div className="profile-icon flex">

            <h1 className="name p-3 text-2xl text-white">
              Antonio Delgado
            </h1>
          </div>
        </div>
        <button type="button" className="editProfile p-3 float-right text-black text-2xl hover:text-gray-700 transition 0.2s" >
          <FontAwesomeIcon icon={faPencilAlt} className="mx-1" />
        </button>
        <div className="roles p-2">
          <h2 className="p-1 font-light text-xl">
            MSci Computer Science
          </h2>
          <h3 className="p-1 font-semibold text-base">
            Artitificial Intelligence
          </h3>
        </div>
        <div className="groups-box p-1 flex">
          <div className="groups p-1 w-1/2">
            <h3 className="p-2 text-base text-black font-semibold">
              Groups
            </h3>
            <div className="bg-gray-800">
              <ul className="groups-list p-1 overflow-y-scroll h-32">
                <li className="p-1 m-2 bg-white flex">
                  <FontAwesomeIcon icon={faUserGroup} className="p-1 text-black text-base" />
                  TN35800
                </li>
                <li className="p-1 m-2 bg-white flex">
                  <FontAwesomeIcon icon={faUserGroup} className="p-1 text-black text-base" />
                  TN45800
                </li>
                <li className="p-1 m-2 bg-white flex">
                  <FontAwesomeIcon icon={faUserGroup} className="p-1 text-black text-base" />
                  TX2900
                </li>
                <li className="p-1 m-2 bg-white flex">
                  <FontAwesomeIcon icon={faUserGroup} className="p-1 text-black text-base" />
                  TC1900
                </li>
                <li className="p-1 m-2 bg-white flex">
                  <FontAwesomeIcon icon={faUserGroup} className="p-1 text-black text-base" />
                  TN1900
                </li>
              </ul>
            </div>
          </div>
          <div className="interest-groups p-1 w-1/2">
            <h3 className="p-2 text-base text-black font-semibold">
              Interest Groups
            </h3>
            <div className="bg-gray-800">
              <ul className="groups-list p-1 overflow-y-scroll h-32">
                <li className="p-1 m-2 bg-white flex">
                  <FontAwesomeIcon icon={faPeopleGroup} className="p-1 text-black text-sm" />
                  Artificial Intelligence
                </li>
                <li className="p-1 m-2 bg-white flex">
                  <FontAwesomeIcon icon={faPeopleGroup} className="p-1 text-black text-sm" />
                  Software Engineering
                </li>
                <li className="p-1 m-2 bg-white flex">
                  <FontAwesomeIcon icon={faPeopleGroup} className="p-1 text-black text-sm" />
                  Databases
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="discover-more m-1 w-2/5 bg-gray-300 border-t-4 border-indigo-600">
        <h2 className="p-2 font-bold text-lg text-black">
          Discover more
        </h2>
        <ul className="suggestions-box p-1">
          <li className="p-1 m-1 bg-white flex">
            <div className="w-1/4 text-3xl">
              <FontAwesomeIcon icon={faUser} className="p-3 m-2 text-white bg-gray-900 rounded-full" />
            </div>
            <div className="suggestion-name-details p-1 w-3/4">
              <h3 className="text-black font-semibold text-sm"> Jean Lucas </h3>
              <h4 className="py-1 text-black font-light text-xs"> BSc Computer Science </h4>
              <button type="button" className="flex p-1 mx-1 bg-gray-800 text-white rounded-xl text-xs hover:bg-gray-600 transition 0.2s">
                <FontAwesomeIcon icon={faUser} className="p-1 mr-2 ml-1 text-gray-800 bg-white rounded-full" />
                <span className="mr-1"> view profile </span>
              </button>
            </div>
          </li>
          <li className="p-1 m-1 bg-white flex">
            <div className="w-1/4 text-3xl">
              <FontAwesomeIcon icon={faUser} className="p-3 m-2 text-white bg-gray-900 rounded-full" />
            </div>
            <div className="suggestion-name-details p-1 w-3/4">
              <h3 className="text-black font-semibold text-sm"> Victoria Garcia </h3>
              <h4 className="py-1 text-black font-light text-xs"> BSc Computer Science </h4>
              <button type="button" className="flex p-1 mx-1 bg-gray-800 text-white rounded-xl text-xs hover:bg-gray-600 transition 0.2s">
                <FontAwesomeIcon icon={faUser} className="p-1 mr-2 ml-1 text-gray-800 bg-white rounded-full" />
                <span className="mr-1"> view profile </span>
              </button>
            </div>
          </li>
          <li className="p-1 m-1 bg-white flex">
            <div className="w-1/4 text-3xl">
              <FontAwesomeIcon icon={faUser} className="p-3 m-2 text-white bg-gray-900 rounded-full" />
            </div>
            <div className="suggestion-name-details p-1 w-3/4">
              <h3 className="text-black font-semibold text-sm"> Adele Jones </h3>
              <h4 className="py-1 text-black font-light text-xs"> BSc Computer Science </h4>
              <button type="button" className="flex p-1 mx-1 bg-gray-800 text-white rounded-xl text-xs hover:bg-gray-600 transition 0.2s">
                <FontAwesomeIcon icon={faUser} className="p-1 mr-2 ml-1 text-gray-800 bg-white rounded-full" />
                <span className="mr-1"> view profile </span>
              </button>
            </div>
          </li>
        </ul>
        <button type="button" className="p-3 text-black font-light hover:font-bold transition 0.1s">
          See more...
        </button>
      </div>

    </div>
  );
}

export default Profile;