/* eslint-disable @typescript-eslint/no-explicit-any */
import { IUserInfo } from "../models";
import { ChartType } from "@pnp/spfx-controls-react/lib/ChartControl";

/**
 * Props for the poll management
 */
export interface IPollManagementProps {
  initialQuestions?: any[];
  pollQuestions: any[];
  SuccessfullVoteSubmissionMsg: string;
  ResponseMsgToUser: string;
  BtnSubmitVoteText: string;
  chartType: ChartType;
  pollBasedOnDate: boolean;
  currentUserInfo: IUserInfo;
  NoPollMsg: string;
  openPropertyPane: () => void;
}