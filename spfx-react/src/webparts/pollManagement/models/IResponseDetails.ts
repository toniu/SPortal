export interface IResponseDetails {
    QuestionID: string;
    UserEmail: string;
    PollResponse: string;

    UserID?: string;
    UserDisplayName?: string;
    UserLoginName?: string;
    PollMultiResponse?: string[];
    PollQuestion?: string;
    PollQuestionId?: string;
    IsMulti?: boolean;
}