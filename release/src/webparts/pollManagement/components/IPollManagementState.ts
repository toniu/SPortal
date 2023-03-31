/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Props the the poll management state
 */
export interface IPollManagementState {
	polls: any[]
	prevPolls: any[],
	ownerPolls: any[],
	isLoading: boolean,
	loadCount: number,
	currentPoll: any,
	activePolls: any[],
	apIndex: number,
	pollResponse: any,

	enableSubmit: boolean,
	enableChoices: boolean,
	showOptions: boolean,
	showProgress: boolean,
	showChart: boolean,
	showChartProgress: boolean,
	PollAnalytics: any,
	showMessage: boolean,
	isError: boolean,
	MsgContent: string,
	showSubmissionProgress: boolean,
	currentPollResponse: string

}