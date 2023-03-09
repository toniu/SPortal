/* eslint-disable @typescript-eslint/no-explicit-any */
import { IQuestionDetails, IResponseDetails } from "../models";

export interface IPollManagementState {
	listExists: boolean;
	PollQuestions: IQuestionDetails[];
	UserResponse: IResponseDetails[];
	displayQuestionId: string;
	displayQuestion: IQuestionDetails;
	enableSubmit: boolean;
	enableChoices: boolean;
	showOptions: boolean;
	showProgress: boolean;
	showChart: boolean;
	showChartProgress: boolean;
	showMessage: boolean;
	isError: boolean;
	MsgContent: string;
	PollAnalytics: any; //IPollAnalyticsInfo;
	showSubmissionProgress: boolean;
	currentPollResponse: string;
}