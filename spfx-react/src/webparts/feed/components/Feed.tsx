/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
import * as React from 'react';
import { IFeedProps } from './IFeedProps';
/* Icons */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser, faUserGroup, faPeopleGroup, faHeart, faComment, faPaperPlane } from "@fortawesome/free-solid-svg-icons"




const Feed = (props: IFeedProps) => {

  return (
    <div className="p-1 m-1 flex">
      <div className="section-a p-1 m-1 w-1/4">
        <div className="bg-gray-300 border-t-4 border-indigo-600">
          <div className="topbar p-3 text-center bg-gray-800 bg-opacity-75">
            <FontAwesomeIcon icon={faUser} className="p-3 bg-gray-700 text-3xl rounded-full text-white " />
          </div>
          <h1 className="name p-2 text-center text-base font-bold text-black">
            Antonio Delgado
          </h1>
          <h2 className="role px-1 py-2 text-center text-xs font-normal text-black">
            MSci Computer Science
          </h2>
        </div>
        <div className="p-1 my-1 bg-gray-300">
          <div className="groups p-1">
            <h3 className="text-black font-semibold">
              Groups
              <button type="button" className="mx-2 text-black font-bold float-right hover:text-gray-700 transition 0.2s">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </h3>
            <ul className="p-2">
              <li>
                <FontAwesomeIcon icon={faUserGroup} />
                <span className="mx-1">
                  GT20
                </span>
              </li>
              <li>
                <FontAwesomeIcon icon={faUserGroup} />
                <span className="mx-1">
                  GT25
                </span>
              </li>
            </ul>
            <button type="button" className="font-normal hover:font-bold transition 0.2s">
              See all...
            </button>
          </div>
          <div className="interest-groups p-1">
            <h3 className="text-black font-semibold">
              Interest groups
              <button type="button" className="mx-2 text-black font-bold float-right hover:text-gray-700 transition 0.2s">
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </h3>
            <ul className="p-2">
              <li>
                <FontAwesomeIcon icon={faPeopleGroup} />
                <span className="mx-1 w-10 overflow-hidden whitespace-no-wrap">
                  Artificial Intelligence
                </span>
              </li>
              <li>
                <FontAwesomeIcon icon={faPeopleGroup} />
                <span className="mx-1 overflow-hidden whitespace-no-wrap">
                  Databases
                </span>
              </li>
              <li>
                <FontAwesomeIcon icon={faPeopleGroup} />
                <span className="mx-1 overflow-hidden whitespace-no-wrap">
                  Software Engineering
                </span>
              </li>
            </ul>
            <button type="button" className="font-normal hover:font-bold transition 0.2s">
              See all...
            </button>
          </div>
        </div>
      </div>
      <div className="section-b p-1 m-1 w-3/4">
        <div className="post-something flex bg-gray-300 border-t-4 border-indigo-600 ">
          <div className="px-3 py-1 m-2 text-gray-800 text-3xl">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="p-1">
            <div className="flex px-2 mx-2 h-8 w-5/6 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
              <input
                className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 focus:text-black"
                type="text"
                placeholder="Post something..."
                id="search" />
            </div>
            <div className="flex p-1 m-1">
              <button className="px-2 py-1 mx-2 bg-indigo-800 rounded-full text-white hover:bg-indigo-600 transition 0.2s">
                <FontAwesomeIcon icon={faUser} />
                <span className="mx-1"> post </span>
              </button>
              <button className="px-2 py-1 mx-2 bg-indigo-800 rounded-full text-white hover:bg-indigo-600 transition 0.2s">
                <FontAwesomeIcon icon={faUser} />
                <span className="mx-1"> event </span>
              </button>
              <button className="px-2 py-1 mx-2 bg-indigo-800 rounded-full text-white hover:bg-indigo-600 transition 0.2s">
                <FontAwesomeIcon icon={faUser} />
                <span className="mx-1"> poll </span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="timeline my-1 p-1 bg-gray-300 w-3/5">
            <ul className="p-1 h-96 bg-black overflow-y-scroll">
              <li className="post p-1 my-1">
                <div className="flex p-2 mx-1 text-white bg-gray-900">
                  <FontAwesomeIcon icon={faHeart} />
                  <span className="mx-2 text-xs font-normal"> Adam Gallager liked </span>
                </div>
                <div className="bg-gray-100 p-2">
                  <div className="who-posted flex">
                    <div className="user-profile-posted-by m-2 px-2 bg-gray-900 text-white p-1 text-lg rounded-full ">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="posted-by-name">
                      <h3 className="text-black font-bold text-sm">
                        Rodger Campbell
                      </h3>
                      <span className="text-black font-normal text-xs">
                        BSc Computer Science
                      </span>
                    </div>
                  </div>
                  <div className="post-caption p-1 text-normal">
                    <span className="h-24 text-elipsis">
                      Very excited to hear about my recent grade in my assignment I can already smell graduation coming next year
                    </span>
                    <button type="button" className="p-3 text-black font-light hover:font-bold transition 0.1s">
                      See more...
                    </button>
                  </div>
                  <div className="post-interaction flex">
                    <div className="interact-numbers flex float-left">
                      <button className="comment-button text-black hover:text-gray-700 font-semibold transition 0.2s">
                        <FontAwesomeIcon icon={faComment} />
                      </button>
                      <span className="mx-2"> 3 </span>
                      <div className="likes-div">
                        <button className="like-button text-pink-900 hover:text-pink-700 font-semibold transiton 0.2s">
                          <FontAwesomeIcon icon={faHeart} />
                        </button>
                        <span className="mx-2"> 15 </span>
                      </div>

                    </div>
                    <div className="share-button mx-5">
                      <button className=" text-black hover:text-gray-700 transition 0.2s">
                      <FontAwesomeIcon icon={faPaperPlane} />
                        <span className="mx-2"> send </span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
              <li className="post p-1 my-1">
                <div className="bg-gray-100 p-2">
                  <div className="who-posted flex">
                    <div className="user-profile-posted-by m-2 px-2 bg-gray-900 text-white p-1 text-lg rounded-full ">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="posted-by-name">
                      <h3 className="text-black font-bold text-sm">
                        Luca Ramos
                      </h3>
                      <span className="text-black font-normal text-xs">
                        BSc Computer Science
                      </span>
                    </div>
                  </div>
                  <div className="post-caption p-1 text-normal">
                    <span className="h-24 text-elipsis">
                      So happy to have the role as the course representative!
                    </span>
                    <button type="button" className="p-3 text-black font-light hover:font-bold transition 0.1s">
                      See more...
                    </button>
                  </div>
                  <div className="post-interaction flex">
                    <div className="interact-numbers flex float-left">
                      <button className="comment-button text-black hover:text-gray-700 font-semibold transition 0.2s">
                        <FontAwesomeIcon icon={faComment} />
                      </button>
                      <span className="mx-2"> 3 </span>
                      <div className="likes-div">
                        <button className="like-button text-pink-900 hover:text-pink-700 font-semibold transiton 0.2s">
                          <FontAwesomeIcon icon={faHeart} />
                        </button>
                        <span className="mx-2"> 9 </span>
                      </div>

                    </div>
                    <div className="share-button mx-5">
                      <button className=" text-black hover:text-gray-700 transition 0.2s">
                      <FontAwesomeIcon icon={faPaperPlane} />
                        <span className="mx-2"> send </span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="w-2/5">
            <div className="m-1 bg-gray-300">
              <div className="flex py-1 px-3 m-1 bg-gray-900 rounded-full text-white text-xs">
                <FontAwesomeIcon className="mx-1" icon={faUser} />
                Sort feed:&nbsp;
                <span className="font-semibold"> Recent </span>
              </div>
            </div>
            <div className="discover-more m-1 bg-gray-300 border-t-4 border-indigo-600">
              <h2 className="p-2 font-bold text-base text-black">
                Discover more
              </h2>
              <ul className="suggestions-box p-1">
                <li className="p-1 m-1 bg-white flex">
                  <div className="w-1/4 text-base">
                    <FontAwesomeIcon icon={faUser} className="p-2 m-2 text-white bg-gray-900 rounded-full" />
                  </div>
                  <div className="suggestion-name-details p-1 w-3/4">
                    <h3 className="text-black font-semibold text-xs"> Jean Lucas </h3>
                    <h4 className="py-1 text-black font-light text-xs"> BSc Computer Science </h4>
                    <button type="button" className="flex p-1 mx-1 bg-gray-800 text-white rounded-xl text-xs hover:bg-gray-600 transition 0.2s">
                      <FontAwesomeIcon icon={faUser} className="p-1 mr-2 ml-1 text-gray-800 bg-white rounded-full" />
                      <span className="mr-1"> view profile </span>
                    </button>
                  </div>
                </li>
                <li className="p-1 m-1 bg-white flex">
                  <div className="w-1/4 text-base">
                    <FontAwesomeIcon icon={faUser} className="p-2 m-2 text-white bg-gray-900 rounded-full" />
                  </div>
                  <div className="suggestion-name-details p-1 w-3/4">
                    <h3 className="text-black font-semibold text-xs"> Victoria Garcia </h3>
                    <h4 className="py-1 text-black font-light text-xs"> BSc Computer Science </h4>
                    <button type="button" className="flex p-1 mx-1 bg-gray-800 text-white rounded-xl text-xs hover:bg-gray-600 transition 0.2s">
                      <FontAwesomeIcon icon={faUser} className="p-1 mr-2 ml-1 text-gray-800 bg-white rounded-full" />
                      <span className="mr-1"> view profile </span>
                    </button>
                  </div>
                </li>
                <li className="p-1 m-1 bg-white flex">
                  <div className="w-1/4 text-base">
                    <FontAwesomeIcon icon={faUser} className="p-2 m-2 text-white bg-gray-900 rounded-full" />
                  </div>
                  <div className="suggestion-name-details p-1 w-3/4">
                    <h3 className="text-black font-semibold text-xs"> Adele Jones </h3>
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
        </div>
      </div>
    </div>
  );
}

export default Feed