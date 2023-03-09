/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

/* SP/PNP imports */
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI } from '@pnp/sp';
import { IList } from "@pnp/sp/lists";
import { getSP } from '../pnpjsConfig';
import { IItemAddResult } from "@pnp/sp/items";
import "@pnp/sp/site-users/web"

import * as _ from "lodash";
import { IUserInfo, IResponseDetails } from "../webparts/pollManagement/models";

export class UserPollService {
    private _sp: SPFI;

    private selectFields: string[] = ["ID", "Title", "QuestionID", "UserResponse"];
    private _polls: IList = null;
    private _list: IList = null;
    private lst_response: string = "";

    public setup(context: WebPartContext): void {
        this._sp = getSP(context);
        this.lst_response = "Polls";
        this._polls = this._sp.web.lists.getByTitle("Polls");
    }

    /**
     * Get the current logged in user information
     */
    public getCurrentUserInfo = async (): Promise<IUserInfo> => {
        let userinfo: IUserInfo = null;
        const currentUserInfo = await this._sp.web.currentUser()
        userinfo = {
            ID: currentUserInfo.Id.toString(),
            Email: currentUserInfo.Email,
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
        const questionResponse = await this._list.items.select(this.selectFields.join(','))
            .filter(`QuestionID eq '${questionId}'`).expand('FieldValuesAsText')();
        if (questionResponse.length > 0) {
            const tmpResponse = questionResponse[0].FieldValuesAsText.UserResponse;
            if (tmpResponse !== undefined && tmpResponse !== null && tmpResponse !== "") {
                const jsonQResponse = JSON.parse(tmpResponse);
                return jsonQResponse;
            } else return [];
        } else return [];
    }
    /**
     * Add the user response.
     */
    public addPollResponse = async (userResponse: IResponseDetails, allUserResponse: any): Promise<IItemAddResult> => {
        const addedresponse = await this._polls.items.add({
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
        return new Promise<boolean>( (resolve, reject) => {
            console.log('')
        })
    }
}

const PollService = new UserPollService();
export default PollService;