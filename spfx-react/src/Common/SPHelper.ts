/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable promise/param-names */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/folders/web";
import "@pnp/sp/files/folder";
import "@pnp/sp/items/list";
import "@pnp/sp/fields/list";
import "@pnp/sp/views/list";
import "@pnp/sp/site-users/web";
import { IList } from "@pnp/sp/lists";
import { IItemAddResult } from "@pnp/sp/items";
import * as _ from "lodash";
import { IUserInfo, IResponseDetails } from "../Models";
import { spfi } from "@pnp/sp";
import { getSP } from "../pnpjsConfig";

export default class SPHelper {
    private selectFields: string[] = ["ID", "Title", "QuestionID", "UserResponse"];
    private _list: IList = null;
    private lst_response: string = "";
    public sp = getSP()

    public constructor() {
        this.lst_response = "QuickPoll";
        this._list = this.sp.web.lists.getByTitle(this.lst_response);
    }
    /**
     * Get the current logged in user information
     */
    public getCurrentUserInfo = async (): Promise<IUserInfo> => {
        let userinfo: IUserInfo = null;
        const currentUserInfo = await this.sp.web.currentUser();
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
    public getPollResponse = async (questionId: string) => {
        const questionResponse: any = await this._list.items.select(this.selectFields.join(','))
            .filter(`QuestionID eq '${questionId}'`).expand('FieldValuesAsText');
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
    public updatePollResponse = async (questionId: string, allUserResponse: any) => {
        const response: any = await this._list.items.select(this.selectFields.join(','))
            .filter(`QuestionID eq '${questionId}'`).expand('FieldValuesAsText');
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
        const sp = spfi();
        return new Promise<boolean>(async (res) => {
            this.sp.web.lists.getByTitle(this.lst_response)().then(() => {
                res(true);
            }).catch(async () => {
                const listExists = await (await sp.web.lists.ensure(this.lst_response)).list;
                await listExists.fields.addText('QuestionID', {MaxLength: 255, Required: true, Description: '' });
                await listExists.fields.addMultilineText('UserResponse', {NumberOfLines: 6, RichText: true, RestrictedMode: false, AppendOnly: false, AllowHyperlink: true, Required: false, Description: '' });
                const allItemsView = await listExists.views.getByTitle('All Items');
                await allItemsView.fields.add('QuestionID');
                await allItemsView.fields.add('UserResponse');
                res(true);
            });
        });
    }
}