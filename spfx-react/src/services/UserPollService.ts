/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* SP/PNP imports */
import "@pnp/sp/webs"
import "@pnp/sp/lists"
import "@pnp/sp/fields"
import "@pnp/sp/views"
import "@pnp/common"
import "@pnp/logging"
import "@pnp/odata"
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from '@pnp/sp';
import { IList } from "@pnp/sp/lists";
import { getSP } from '../pnpjsConfig';
import { IItemAddResult } from "@pnp/sp/items";
import "@pnp/sp/site-users/web"

import * as _ from "lodash";
import { IUserInfo, IResponseDetails, IQuestionDetails } from "../webparts/pollManagement/models";

export class UserPollService {
    private _sp: SPFI;

    private selectFields: string[] = ["ID", "Title", "QuestionID", "UserResponse"];
    private _list: IList = null;
    private lst_response: string = "";
    private _polls: IList = null;
    private _pollResponses: IList = null;

    private currentUser: any;

    public async setup(context: WebPartContext): Promise<void> {
        this._sp = getSP(context);
        this.lst_response = "PollsX";
        this._list = this._sp.web.lists.getByTitle(this.lst_response);

        /* Sharepoint lists */
        this._polls = this._sp.web.lists.getByTitle("Polls")
        this._pollResponses = this._sp.web.lists.getByTitle("PollResponses")

        this.currentUser = await this.getCurrentUserInfo();
    }

    /**
     * Get the current logged in user information
     */
    public getCurrentUserInfo = async (): Promise<IUserInfo> => {
        let userinfo: IUserInfo = null;
        const currentUserInfo = await this._sp.web.currentUser()
        userinfo = {
            ID: currentUserInfo.Id.toString(),
            Email: currentUserInfo.UserPrincipalName,
            LoginName: currentUserInfo.LoginName,
            DisplayName: currentUserInfo.Title,
            Picture: '/_layouts/15/userphoto.aspx?size=S&username=' + currentUserInfo.UserPrincipalName,
        };
        return userinfo;
    }
    /**
     * Get the poll response based on the question id.
     */
    public getPollResponse = async (questionId: string): Promise<any> => {
        console.log('1', questionId)
        const questionResponse = await this._list.items.select(this.selectFields.join(','))
            .filter(`QuestionID eq '${questionId}'`).expand('FieldValuesAsText')();

        console.log('2', questionResponse)
        if (questionResponse.length > 0) {
            const tmpResponse = questionResponse[0].FieldValuesAsText.UserResponse;

            console.log('3', tmpResponse)
            if (tmpResponse !== undefined && tmpResponse !== null && tmpResponse !== "") {
                const jsonQResponse = JSON.parse(tmpResponse);

                console.log('4', jsonQResponse)
                return jsonQResponse;
            } else return [];
        } else return [];
    }
    /**
     * Add the user response.
     */
    public addPollResponse = async (userResponse: IResponseDetails, allUserResponse: any): Promise<IItemAddResult> => {
        const addedresponse = await this._list.items.add({
            Title: userResponse.PollQuestion,
            QuestionID: userResponse.PollQuestionId,
            UserResponse: JSON.stringify(allUserResponse)
        });
        return addedresponse;
    }
    /**
     * Update the over all response based on the end user response.
     */
    public updatePollResponse = async (questionId: string, allUserResponse: any): Promise<any> => {
        const response = await this._list.items.select(this.selectFields.join(','))
            .filter(`QuestionID eq '${questionId}'`).expand('FieldValuesAsText')();
        if (response.length > 0) {
            if (allUserResponse.length > 0) {
                const updatedResponse = await this._list.items.getById(response[0].ID).update({
                    UserResponse: JSON.stringify(allUserResponse)
                });
                return updatedResponse;
            } else return await this._list.items.getById(response[0].ID).delete();
        }
    }
    /**
     * Submit the user response.
     */
    public submitResponse = async (userResponse: IResponseDetails): Promise<boolean> => {
        try {
            const allUserResponse = await this.getPollResponse(userResponse.PollQuestionId);
            if (allUserResponse.length > 0) {
                allUserResponse.push({
                    UserID: userResponse.UserID,
                    UserName: userResponse.UserDisplayName,
                    Response: userResponse.PollResponse,
                    MultiResponse: userResponse.PollMultiResponse,
                });
                // Update the user response
                await this.updatePollResponse(userResponse.PollQuestionId, allUserResponse);
            } else {
                allUserResponse.push({
                    UserID: userResponse.UserID,
                    UserName: userResponse.UserDisplayName,
                    Response: userResponse.PollResponse,
                    MultiResponse: userResponse.PollMultiResponse,
                });
                // Add the user response
                await this.addPollResponse(userResponse, allUserResponse);
            }
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    /**
     * Check and create the User response list.
     */
    public checkListExists = async (): Promise<boolean> => {
        let done: boolean = false
        await this._sp.web.lists.getByTitle(this.lst_response)().then((listExists) => {
            if (listExists) {
                done = true
            }
        }).catch(async err => {
            const listExists = await (await (await this._sp.web.lists.ensure(this.lst_response)).list);

            await listExists.fields.addText('QuestionID', { Required: true, MaxLength: 255, Description: '' });
            await listExists.fields.addMultilineText('UserResponse', { NumberOfLines: 6, Required: false, Description: '' });
            const allItemsView = await listExists.views.getByTitle('All Items');
            await allItemsView.fields.add('QuestionID');
            await allItemsView.fields.add('UserResponse');

            done = true
        });

        return new Promise<boolean>((resolve, reject) => {
            resolve(done);
        });
    }

    /*-- MODIFIED --*/

    public igetPolls = async (questions?: any[]): Promise<any> => {
        /* Get items from polls */
        const polls = await this._polls.items()
        console.log('Polls, ', polls)

        return new Promise<any>((resolve) => {
            try {
                const spPolls: IQuestionDetails[] = [];
                polls.map((item: any) => {
                    spPolls.push({
                        Id: item.Title,
                        DisplayName: item.field_1,
                        Choices: item.field_2,
                        Visibility: item.field_3,
                        UseDate: false,
                        StartDate: new Date(item.field_4),
                        EndDate: new Date(item.field_5),
                        Owner: item.field_6,
                        SortIdx: item.ID,
                        SPId: item.ID
                    })
                })
                /* 
                        Id: question.uniqueId,
          DisplayName: question.QTitle,
          Choices: question.QOptions,
          UseDate: question.QUseDate,
          StartDate: new Date(question.QStartDate),
          EndDate: new Date(question.QEndDate),
          MultiChoice: question.QMultiChoice,
          SortIdx: question.sortIdx*/

                resolve(spPolls)
            } catch (e) {
                console.error(e);
            }
        })

    }

    public igetPollResponses = async (pollId: any): Promise<any> => {
        /* Get items from poll responses of specific poll */
        const pollResponses = await this._pollResponses.items.filter(`Title eq '${pollId}'`)()

        return new Promise<any>((resolve) => {
            try {
                const spPollResponses: IResponseDetails[] = [];
                pollResponses.map((item: any) => {
                    spPollResponses.push({
                        QuestionID: item.Title,
                        UserEmail: item.field_1,
                        PollResponse: item.field_2
                    })
                })
                resolve(spPollResponses)
            } catch (e) {
                console.error(e);
            }
        });
    }

    public checkSubmitted = async (pollId: any): Promise<boolean> => {
        const pollResponses = await this.igetPollResponses(pollId)

        return new Promise<boolean>((resolve) => {
            try {
                const responsesByUser = pollResponses.filter((pR: any) => pR.userEmail.toLowerCase() === this.currentUser.Email.toLowerCase())
                if (responsesByUser.length > 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            } catch (e) {
                console.error(e);
            }
        });
    }

    public isubmitResponseToPoll = async (userResponse: IResponseDetails): Promise<void> => {
        try {
            /* SP List PollResponses fields:
            Title,
            field_1: Email
            field_2: Response */

            const responseRequest: any = {
                Title: userResponse.QuestionID,
                field_1: userResponse.UserEmail,
                field_2: userResponse.PollResponse
            }

            const iar: IItemAddResult = await this._pollResponses.items.add(responseRequest)
            console.log('Poll vote submitted...\n', iar)

        } catch (err) {
            console.log(err);
        }
    }

    public iremoveResponsesFromPoll = async (pollId: string, userEmails: any): Promise<void> => {
        /* Batch delete from poll responses */
        try {
            /* Retrieve the Sharepoint list ID (required to delete item with) */
            const spList = await this._pollResponses.items()
            /* Use filter to find the items with the pollId and the member emails to delete */
            const pollResponses = spList.filter(item => item.Title === pollId && userEmails.indexOf(item.field_1) >= 0)

            /*--- SP batch post request to remove selected poll responses */
            /* if item is found */
            if (pollResponses[0]) {
                const [batchedSP, execute] = this._sp.batched();
                const batchedPollResponses = batchedSP.web.lists.getByTitle("PollResponses");

                let res: any[] = [];
                res = [];

                /* Add SP batch for removing poll responses */
                for (let i = 0; i < pollResponses.length; i++) {
                    batchedPollResponses.items.getById(pollResponses[i].ID).delete().then(r => res.push(r))
                        .catch(e => console.log(e));
                }

                /* Execute batch for removing selected poll responses */
                await execute();
                console.log('\nFinal response from removed poll responses: ')
                for (let i = 0; i < res.length; i++) {
                    console.log(res[i])
                }
            } else {
                console.log('Remove poll responses request failed')
            }
        } catch (e) {
            console.log(e)
        }
    }

    public icreatePoll = async (pollQuestion: string, options: string, visibility: string, startDate: any, endDate: any): Promise<void> => {
        /* Add poll into polls */
        /* ID creation: generated using timestamp */
        const generatedPollId = 'p-' + (Date.now() + Math.random()).toString()

        /* POLL REQUEST COLUMNS:
            Title: the generated poll ID
            field_1: Question
            field_2: Options
            field_3: Visibility
            field_4: StartDate
            field_5: EndDate
            field_6: Owner
        };
        */
        const pollRequest: any = {
            Title: generatedPollId,
            field_1: pollQuestion,
            field_2: options,
            field_3: visibility,
            field_4: startDate,
            field_5: endDate,
            field_6: this.currentUser.Email
        }

        console.log('Creating new poll of request ', pollRequest)

        /* SP post request to create new group */
        const iar: IItemAddResult = await this._polls.items.add(pollRequest);
        console.log('Poll created...\n', iar)
    }

    public ieditPoll = async (spPollID: number, pollId: string, visibility: string, startDate: any, endDate: any): Promise<void> => {
        /* User only has the ability to change the visibility of poll, or the start and end date */
        try {
            /* In context to internal fields
            field_3: the poll visibility
            field_4: the start date
            field_5: the end date
            */
            const updateRequest: any = {
                field_3: visibility,
                field_4: startDate,
                field_5: endDate
            }

            /* Update group details */
            const isUpdated = await this._polls.items.getById(spPollID).update(updateRequest);
            console.log(isUpdated)

            console.log('Edit poll service done!')
        } catch (e) {
            console.log(e)
        }
    }

    public ideletePoll = async (pollId: string): Promise<void> => {
        /* Retrieve the Sharepoint list ID (required to delete item with) */
      const pollToDelete = await this._polls.items.filter(`Title eq '${pollId}'`)()
      console.log('PTD', pollToDelete)

      /* If item is found */
      if (pollToDelete[0]) {
        /* Delete using the Sharepoint list item ID (note: this is different to the groupId) */
        await this._polls.items.getById(pollToDelete[0].ID).delete();
        console.log(`Poll ID ${pollId} deleted...\n`)
      } else {
        console.log('Delete request failed - no poll to delete')
      }

      /* SP List for poll responses to delete */
      let pollResponses = await this.igetPollResponses(pollId)
      pollResponses = pollResponses.map((p: any) => p.userEmail)

      /* Finally remove all responses from poll */
      await this.iremoveResponsesFromPoll(pollId, pollResponses)
    }
}

const PollService = new UserPollService();
export default PollService;