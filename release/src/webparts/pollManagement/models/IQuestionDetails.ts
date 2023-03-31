/**
 * The model for details of a poll
 */
export interface IQuestionDetails {
	Id: string;
	DisplayName: string;
	Choices?: string;
	MultiChoice?: boolean;
	StartDate: Date;
	EndDate: Date;
	UseDate: boolean;
	Visibility: string;
	SortIdx: number;
	Owner: string;
	SPId: number;
}