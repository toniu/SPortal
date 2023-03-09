/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import styles from './PollManagement.module.scss';
import * as strings from 'PollManagementWebPartStrings';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { ProgressIndicator } from 'office-ui-fabric-react/lib/ProgressIndicator';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { IPollManagementProps } from './IPollManagementProps';
import { IPollManagementState } from './IPollManagementState';
import OptionsContainer from './OptionsContainer/OptionsContainer';
import MessageContainer from './MessageContainer/MessageContainer';
import QuickPollChart from './ChartContainer/QuickPollChart';
import { IQuestionDetails, IResponseDetails, IPollAnalyticsInfo } from '../models';
import UserPollService from '../../../services/UserPollService';
import { MessageScope } from '../../../common/enumHelper';
import * as _ from 'lodash';
import * as moment from 'moment';

export default class PollManagement extends React.Component<IPollManagementProps, IPollManagementState> {
  private disQuestionId: string;
  private displayQuestion: IQuestionDetails;
  constructor(props: IPollManagementProps) {
    super(props);
    this.state = {
      listExists: false,
      PollQuestions: [],
      UserResponse: [],
      displayQuestionId: "",
      displayQuestion: null,
      enableSubmit: true,
      enableChoices: true,
      showOptions: false,
      showProgress: false,
      showChart: false,
      showChartProgress: false,
      PollAnalytics: undefined,
      showMessage: false,
      isError: false,
      MsgContent: "",
      showSubmissionProgress: false,
      currentPollResponse: ""
    };
  }

  public componentDidMount = (): void => {
    this.checkAndCreateList().catch((e: any) => console.log(e));
  }

  public componentDidUpdate = (prevProps: IPollManagementProps): void => {
    if (prevProps.pollQuestions !== this.props.pollQuestions || prevProps.pollBasedOnDate !== this.props.pollBasedOnDate) {
      this.setState({
        UserResponse: [],
        displayQuestion: null,
        displayQuestionId: ''
      }, () => {
        this.getQuestions(this.props.pollQuestions);
      });
    }
    if (prevProps.chartType !== this.props.chartType) {
      const newPollAnalytics: IPollAnalyticsInfo = this.state.PollAnalytics;
      newPollAnalytics.ChartType = this.props.chartType;
      this.setState({
        PollAnalytics: newPollAnalytics
      }, this.bindResponseAnalytics);
    }
  }

  private async checkAndCreateList(): Promise<void> {
    const listCreated = await UserPollService.checkListExists();
    if (listCreated) {
      this.setState({ listExists: true }, () => {
        this.getQuestions();
      });
    }
  }

  private getQuestions = (questions?: any[]): void => {
    const pquestions: IQuestionDetails[] = [];
    const tmpQuestions: any[] = (questions) ? questions : (this.props.pollQuestions) ? this.props.pollQuestions : [];
    if (tmpQuestions && tmpQuestions.length > 0) {
      tmpQuestions.map((question) => {
        pquestions.push({
          Id: question.uniqueId,
          DisplayName: question.QTitle,
          Choices: question.QOptions,
          UseDate: question.QUseDate,
          StartDate: new Date(question.QStartDate),
          EndDate: new Date(question.QEndDate),
          MultiChoice: question.QMultiChoice,
          SortIdx: question.sortIdx
        });
      });
    }
    this.disQuestionId = this.getDisplayQuestionID(pquestions);
    this.setState({ PollQuestions: pquestions, displayQuestionId: this.disQuestionId, displayQuestion: this.displayQuestion }, this.bindPolls);
  }

  private getDisplayQuestionID = (questions?: any[]): any => {
    let filQuestions: any[] = [];
    if (questions.length > 0) {
      if (this.props.pollBasedOnDate) {
        filQuestions = _.filter(questions, (o) => { return moment().startOf('date') >= moment(o.StartDate) && moment(o.EndDate) >= moment().startOf('date'); });
      } else {
        filQuestions = _.orderBy(questions, ['SortIdx'], ['asc']);
        this.displayQuestion = filQuestions[0];
        return filQuestions[0].Id;
      }
      if (filQuestions.length > 0) {
        filQuestions = _.orderBy(filQuestions, ['SortIdx'], ['asc']);
        this.displayQuestion = filQuestions[0];
        return filQuestions[0].Id;
      } else {
        this.displayQuestion = null;
      }
    }
    return '';
  }

  private bindPolls = (): void => {
    this.setState({
      showProgress: (this.state.PollQuestions.length > 0) ? true : false,
      enableSubmit: true,
      enableChoices: true,
      showOptions: false,
      showChart: false,
      showChartProgress: false,
      PollAnalytics: undefined,
      showMessage: false,
      isError: false,
      MsgContent: "",
      showSubmissionProgress: false
    }, this.getAllUsersResponse);
  }

  private _onChange = (ev: any, option: any, isMultiSel: boolean): void => {
    const prevUserResponse = this.state.UserResponse;
    const userResponse: IResponseDetails = {
      PollQuestionId: this.state.displayQuestion.Id,
      PollQuestion: this.state.displayQuestion.DisplayName,
      PollResponse: !isMultiSel ? option.key : '',
      UserID: this.props.currentUserInfo.ID,
      UserDisplayName: this.props.currentUserInfo.DisplayName,
      UserLoginName: this.props.currentUserInfo.LoginName,
      PollMultiResponse: isMultiSel ? option.key : [],
      IsMulti: isMultiSel
    };
    if (prevUserResponse.length > 0) {
      const filRes = this.getUserResponse(prevUserResponse);
      if (filRes.length > 0) {
        if (!isMultiSel) {
          filRes[0].PollResponse = option.key
        } else {
          filRes[0].PollMultiResponse = option.key
        }
      } else {
        prevUserResponse.push(userResponse);
      }
    } else {
      prevUserResponse.push(userResponse);
    }
    this.setState({
      ...this.state,
      UserResponse: prevUserResponse
    });
  }

  private _getSelectedKey = (): string => {
    let selKey: string = "";
    if (this.state.UserResponse && this.state.UserResponse.length > 0) {
      const userResponses = this.state.UserResponse;
      const userRes = this.getUserResponse(userResponses);
      if (userRes.length > 0) {
        selKey = userRes[0].PollResponse;
      }
    }
    return selKey;
  }

  private _submitVote = async (): Promise<void> => {
    this.setState({
      ...this.state,
      enableSubmit: false,
      enableChoices: false,
      showSubmissionProgress: false,
      isError: false,
      MsgContent: '',
      showMessage: false
    });
    const curUserRes = this.getUserResponse(this.state.UserResponse);
    if (curUserRes.length <= 0) {
      this.setState({
        MsgContent: strings.SubmitValidationMessage,
        isError: true,
        showMessage: true,
        enableSubmit: true,
        enableChoices: true,
      });
    } else {
      this.setState({
        ...this.state,
        enableSubmit: false,
        enableChoices: false,
        showSubmissionProgress: true,
        isError: false,
        MsgContent: '',
        showMessage: false
      });
      try {
        await UserPollService.submitResponse(curUserRes[0]);
        this.setState({
          ...this.state,
          showSubmissionProgress: false,
          showMessage: true,
          isError: false,
          MsgContent: (this.props.SuccessfullVoteSubmissionMsg && this.props.SuccessfullVoteSubmissionMsg.trim()) ?
            this.props.SuccessfullVoteSubmissionMsg.trim() : strings.SuccessfullVoteSubmission,
          showChartProgress: true
        }, this.getAllUsersResponse);
      } catch (err) {
        console.log(err);
        this.setState({
          ...this.state,
          enableSubmit: true,
          enableChoices: true,
          showSubmissionProgress: false,
          showMessage: true,
          isError: true,
          MsgContent: strings.FailedVoteSubmission
        });
      }
    }
  }

  private getAllUsersResponse = async (): Promise<void> => {
    const usersResponse = await UserPollService.getPollResponse((this.state.displayQuestionId) ? this.state.displayQuestionId : this.disQuestionId);
    const filRes = _.filter(usersResponse, (o) => { return o.UserID === this.props.currentUserInfo.ID; });
    if (filRes.length > 0) {
      this.setState({
        showChartProgress: true,
        showChart: true,
        showOptions: false,
        showProgress: false,
        UserResponse: usersResponse,
        currentPollResponse: filRes[0].Response ? filRes[0].Response : filRes[0].MultiResponse.join(',')
      }, this.bindResponseAnalytics);
    } else {
      this.setState({
        showProgress: false,
        showOptions: true,
        showChartProgress: false,
        showChart: false
      });
    }
  }

  private bindResponseAnalytics = (): void => {
    const { displayQuestion } = this.state;
    const tmpUserResponse: any = this.state.UserResponse;
    if (tmpUserResponse && tmpUserResponse.length > 0) {
      let tempData: any;
      const qChoices: string[] = displayQuestion.Choices.split(',');
      const finalData: any[] = [];
      if (!displayQuestion.MultiChoice) {
        tempData = _.countBy(tmpUserResponse, 'Response');
      } else {
        const data: any[] = [];
        tmpUserResponse.map((res: any) => {
          if (res.MultiResponse && res.MultiResponse.length > 0) {
            res.MultiResponse.map((finres: any) => {
              data.push({
                "UserID": res.UserID,
                "Response": finres.trim()
              });
            });
          }
        });
        tempData = _.countBy(data, 'Response');
      }
      qChoices.map((label) => {
        if (tempData[label.trim()] === undefined) {
          finalData.push(0);
        } else finalData.push(tempData[label.trim()]);
      });
      const pollAnalytics: IPollAnalyticsInfo = {
        ChartType: this.props.chartType,
        Labels: qChoices,
        Question: displayQuestion.DisplayName,
        PollResponse: finalData
      };
      this.setState({
        showProgress: false,
        showOptions: false,
        showChartProgress: false,
        showChart: true,
        PollAnalytics: pollAnalytics
      });
    }
  }

  private getUserResponse(UserResponses: IResponseDetails[]): IResponseDetails[] {
    const retUserResponse: IResponseDetails[] = UserResponses.filter((res) => { return res.UserID === this.props.currentUserInfo.ID; });
    return retUserResponse;
  }

  public render(): React.ReactElement<IPollManagementProps> {
    const { pollQuestions, BtnSubmitVoteText, ResponseMsgToUser, NoPollMsg } = this.props;
    const { showProgress, enableChoices, showSubmissionProgress, showChartProgress, PollQuestions, showMessage, MsgContent, isError,
      showOptions, showChart, PollAnalytics, currentPollResponse, enableSubmit, listExists, displayQuestion } = this.state;
    const showConfig: boolean = (!pollQuestions || pollQuestions.length <= 0 && (!PollQuestions || PollQuestions.length <= 0)) ? true : false;
    const userResponseCaption: string = (ResponseMsgToUser && ResponseMsgToUser.trim()) ? ResponseMsgToUser.trim() : strings.DefaultResponseMsgToUser;
    const submitButtonText: string = (BtnSubmitVoteText && BtnSubmitVoteText.trim()) ? BtnSubmitVoteText.trim() : strings.BtnSumbitVote;
    const nopollmsg: string = (NoPollMsg && NoPollMsg.trim()) ? NoPollMsg.trim() : strings.NoPollMsgDefault;
    return (
      <div className={styles.pollManagement}>
        {!listExists ? (
          <ProgressIndicator label={strings.ListCreationText} description={strings.PlsWait} />
        ) : (
            <>
              {showConfig &&
                <Placeholder iconName='Edit'
                  iconText={strings.PlaceholderIconText}
                  description={strings.PlaceholderDescription}
                  buttonLabel={strings.PlaceholderButtonLabel}
                  onConfigure={this.props.openPropertyPane} />
              }
              {showProgress && !showChart &&
                <ProgressIndicator label={strings.QuestionLoadingText} description={strings.PlsWait} />
              }
              {!displayQuestion && !showConfig &&
                <MessageContainer MessageScope={MessageScope.Info} Message={nopollmsg} />
              }
              {PollQuestions && PollQuestions.length > 0 && showOptions && displayQuestion &&
                <div className="ms-Grid" dir="ltr">
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg12 ms-md12 ms-sm12">
                      <div className="ms-textAlignLeft ms-font-m-plus ms-fontWeight-semibold">
                        {displayQuestion.DisplayName}
                      </div>
                    </div>
                  </div>
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg12 ms-md12 ms-sm12">
                      <div className="ms-textAlignLeft ms-font-m-plus ms-fontWeight-semibold">
                        <OptionsContainer disabled={!enableChoices} multiSelect={displayQuestion.MultiChoice}
                          selectedKey={this._getSelectedKey}
                          options={displayQuestion.Choices}
                          label="Pick One"
                          onChange={this._onChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-lg12 ms-md12 ms-sm12">
                      <div className="ms-textAlignCenter ms-font-m-plus ms-fontWeight-semibold">
                        <PrimaryButton disabled={!enableSubmit} text={submitButtonText}
                          onClick={this._submitVote.bind(this)} />
                      </div>
                    </div>
                  </div>
                  {showSubmissionProgress && !showChartProgress &&
                    <ProgressIndicator label={strings.SubmissionLoadingText} description={strings.PlsWait} />
                  }
                </div>
              }
              {showMessage && MsgContent &&
                <MessageContainer MessageScope={(isError) ? MessageScope.Failure : MessageScope.Success} Message={MsgContent} />
              }
              {showChartProgress && !showChart &&
                <ProgressIndicator label="Loading the Poll analytics" description="Getting all the responses..." />
              }
              {showChart &&
                <>
                  <QuickPollChart PollAnalytics={PollAnalytics} />
                  <MessageContainer MessageScope={MessageScope.Info} Message={`${userResponseCaption}: ${currentPollResponse}`} />
                </>
              }
            </>
          )
        }
      </div>
    );
  }
}