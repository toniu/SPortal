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
// Models: IResponseDetails, IPollAnalyticsInfo
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
      polls: [],
      prevPolls: this.props.pollQuestions,
      ownerPolls: [],
      isLoading: true,
      loadCount: 0,
      currentPoll: {},
      activePolls: [],
      apIndex: 0,
      pollResponse: [],

      /* -- */
      enableSubmit: false,
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

    this.disQuestionId = ''
    this.displayQuestion = null
    console.log(this.disQuestionId, this.displayQuestion)
  }

  public componentDidMount = async (): Promise<void> => {
    await this._getPolls();
  }

  public componentDidUpdate = async (prevProps: IPollManagementProps): Promise<void> => {

    /* If the poll questions or enable poll based on date changed */
    if (prevProps.pollQuestions !== this.props.pollQuestions || prevProps.pollBasedOnDate !== this.props.pollBasedOnDate) {
      console.log('Update fired for props or poll based on date')

      /* Check if any new polls should be created or deleted - based on saved changes */
      const pollsBefore = this.state.prevPolls;
      const pollsAfter = this.props.pollQuestions;

      const includesPoll = (p: any, polls: any[]): boolean => {
        for (let i = 0; i < polls.length; i++) {
          if (polls[i].uniqueId === p.uniqueId) {
            return true;
          }
        }
        return false
      }

      const pollsToCreate = pollsAfter.filter((p: any) => !includesPoll(p, pollsBefore))
      const pollsToDelete = pollsBefore.filter((p: any) => !includesPoll(p, pollsAfter))

      console.log('Poll BEFORE: ', pollsBefore)
      console.log('Poll AFTER: ', pollsAfter)
      console.log('\nPolls to ADD: ', pollsToCreate)
      console.log('Polls to REMOVE: ', pollsToDelete)

      /* Are there any new polls to create based on saved changes? */
      if (pollsToCreate.length > 0) {
        for (let i = 0; i < pollsToCreate.length; i++) {
          console.log('PTC: ', pollsToCreate[i])
          await UserPollService.icreatePoll(pollsToCreate[i].uniqueId,
            pollsToCreate[i].QTitle,
            pollsToCreate[i].QOptions,
            /* SP List Context: visibility: 'Public' -> true; 'Private' -> false */
            pollsToCreate[i].Visibility !== null ? (pollsToCreate[i].Visibility === true ? 'Public' : 'Private' ) : 'Private',
            pollsToCreate[i].QStartDate,
            pollsToCreate[i].QEndDate)
        }
      }

      /* Are there any polls to delete based on saved changes? */
      if (pollsToDelete.length > 0) {
        for (let i = 0; i < pollsToDelete.length; i++) {
          await UserPollService.ideletePoll(pollsToDelete[i].uniqueId)
        }
      }

      /* Check if any polls require updating */
      const epBefore = pollsBefore.filter((p: any) => !includesPoll(p, pollsToDelete))
      const epAfter = pollsAfter.filter((p: any) => !includesPoll(p, pollsToCreate))

      console.log('\nExisting polls BEFORE: ', epBefore)
      console.log('\nExisting polls AFTER: ', epAfter)

      /* Only checking the polls that were already in the list */
      for (let i = 0; i < epAfter.length; i++) {
        let shouldChange = false;
        let newStartDate = epBefore[i].StartDate
        let newEndDate = epBefore[i].EndDate

        /* Check for property change in start date */
        if (new Date(epAfter[i].QStartDate).getTime() !== new Date(epBefore[i].QStartDate).getTime()) {
          shouldChange = true
          newStartDate = epAfter[i].QStartDate
          console.log('StartDate Changed for item ', i, ': ', epBefore[i].QStartDate, ' to ', epAfter[i].QStartDate)
        }

        /* Check for property change in end date */
        if (new Date(epAfter[i].QEndDate).getTime() !== new Date(epBefore[i].QEndDate).getTime()) {
          shouldChange = true
          newEndDate = epAfter[i].QEndDate
          console.log('EndDate changed for item', i, ': ', epBefore[i].QEndDate, ' to ', epAfter[i].QEndDate)
        }

        /* Check for property change in visibility */
        if (epAfter[i].Visibility !== epBefore[i].Visibility) {
          shouldChange = true
          console.log('Visibility changed for item', i)
        }

        /* Finally call method to update any details */
        if (shouldChange) {
          await UserPollService.ieditPoll(epAfter[i].uniqueId,
            epAfter[i].Visibility !== null ? (epAfter[i].Visibility === true ? 'Public' : 'Private' ) : 'Private',
            newStartDate,
            newEndDate)
        }
      }


      this.setState({
        prevPolls: pollsAfter,
        pollResponse: [],
        currentPoll: {},
      }, () => this._getPolls());
      // this.getQuestions(this.props.pollQuestions);
    }

    /* If the chart type has changed: re-render results */
    if (prevProps.chartType !== this.props.chartType) {
      console.log('Update fired for chart')
      const newPollAnalytics: IPollAnalyticsInfo = this.state.PollAnalytics;
      newPollAnalytics.ChartType = this.props.chartType;
      this.setState({
        PollAnalytics: newPollAnalytics
      }, this._bindResponseAnalytics);
    }
  }

  public _onChange = (ev: any, option: any, isMultiSel: boolean): void => {
    const prevUserResponse = this.state.pollResponse;

    const userResponse: IResponseDetails = {
      QuestionID: this.state.currentPoll.Id,
      UserEmail: this.props.currentUserInfo.Email,
      PollResponse: option.key
    }

    if (prevUserResponse.length > 0) {
      const fillRes = this._getCurrentUserResponse(prevUserResponse);
      if (fillRes.length > 0) {
        fillRes[0].PollResponse = option.key
      } else {
        prevUserResponse.push(userResponse)
      }
    } else {
      prevUserResponse.push(userResponse)
    }

    console.log('Changed! new response: ', prevUserResponse)
    this.setState({
      ...this.state,
      enableSubmit: true,
      pollResponse: prevUserResponse
    });
  }

  private _getSelectedKey = (): string => {
    let selKey: string = "";
    if (this.state.pollResponse && this.state.pollResponse.length > 0) {
      const userResponses = this.state.pollResponse;
      const userRes = this._getCurrentUserResponse(userResponses);
      if (userRes.length > 0) {
        selKey = userRes[0].PollResponse;
      }
    }
    return selKey;
  }

  public _submitVote = async (): Promise<void> => {
    try {
      console.log('Submit with current state', this.state)

      /* Initial state before checking if response exists */
      this.setState({
        ...this.state,
        enableSubmit: false,
        enableChoices: false,
        showSubmissionProgress: false,
        isError: false,
        MsgContent: '',
        showMessage: false
      });

      const existingUR = this._getCurrentUserResponse(this.state.pollResponse);
      /* Error: response does not exist / is invalid */
      if (existingUR.length <= 0) {
        this.setState({
          MsgContent: strings.SubmitValidationMessage,
          isError: true,
          showMessage: true,
          enableSubmit: true,
          enableChoices: true
        })
      } else {
        /* Submission progress.. */
        this.setState({
          ...this.state,
          enableSubmit: false,
          enableChoices: false,
          showSubmissionProgress: true,
          isError: false,
          MsgContent: '',
          showMessage: false
        });

        /* Valid response: call service to finally submit poll response
        as well as viewing the poll results */

        try {
          console.log('Poll submitted!', this.state.pollResponse[0])
          await UserPollService.isubmitResponseToPoll(this.state.pollResponse[0]).catch((e: any) => console.log(e));

          this.setState({
            ...this.state,
            showSubmissionProgress: false,
            showMessage: true,
            isError: false,
            MsgContent: (this.props.SuccessfullVoteSubmissionMsg && this.props.SuccessfullVoteSubmissionMsg.trim()) ?
              this.props.SuccessfullVoteSubmissionMsg.trim() : strings.SuccessfullVoteSubmission,
            showChartProgress: true
          }, this._getUserResponses);

        } catch (e) {
          console.log(e)
          this.setState({
            ...this.state,
            enableSubmit: true,
            enableChoices: true,
            showSubmissionProgress: false,
            showMessage: true,
            isError: true,
            MsgContent: strings.FailedVoteSubmission
          })
        }
      }


    } catch (e) {
      console.log(e)
    }
  }

  public _getCurrentUserResponse(userResponse: any): any {
    const retUR: IResponseDetails[] = userResponse.filter((res: any) => { return res.UserEmail === this.props.currentUserInfo.Email; });
    return retUR;
  }

  public _getPolls = async (): Promise<void> => {
    const userInfo = await UserPollService.getCurrentUserInfo()

    /* */

    UserPollService.igetPolls().then(polls => {
      /* Console log of SP Polls from SP list: Polls */
      console.log('Polls: ', polls)

      /* Only polls that are owned by the current user */

      /* Set default value of using date or not */
      for (let i = 0; i < polls.length; i++) {
        polls[i].UseDate = this.props.pollBasedOnDate
      }
      const ownerPolls = polls.filter((poll: any) => poll.Owner === userInfo.Email)

      console.log('Polls owned by YOU: ', ownerPolls)

      this.disQuestionId = this._checkActivePolls(ownerPolls)
       /* Set state code [...]: isLoading, polls, loadCount */
      this.setState({
        isLoading: false,
        polls: polls,
        ownerPolls: ownerPolls,
        loadCount: this.state.loadCount + 1
      }, this._bindPolls)
    }).catch((e: any) => console.log(e));

  }

  public _checkActivePolls = (polls: any): any => {
    let activePolls: any[] = []
    console.log('Checking polls from ', polls)

    if (polls.length > 0) {
      if (this.props.pollBasedOnDate) {
        /* Case 1: the scheduled polls option is ENABLED */
        /* Active polls should be public and within the time frame */
        activePolls = _.filter(polls, (o) => { return o.Visibility === 'Public' && moment().startOf('date') >= moment(o.StartDate) && moment(o.EndDate) >= moment().startOf('date'); });
      } else {
        /* Case 2: the schedule polls option is DISABLED */
        /* Active polls should be public */
        const orderedPolls = _.orderBy(polls, ['SortIdx'], ['asc']);
        activePolls = orderedPolls.filter((poll: any) => poll.Visibility === 'Public')
        this.displayQuestion = activePolls[0];

        this.setState({
          activePolls: activePolls,
          currentPoll: activePolls[this.state.apIndex]
        })

        console.log('... to active polls: ', activePolls)

        return activePolls[0].Id
      }

      if (activePolls.length > 0) {
        activePolls = _.orderBy(activePolls, ['SortIdx'], ['asc']);
        this.displayQuestion = activePolls[0];

        this.setState({
          activePolls: activePolls,
          currentPoll: activePolls[this.state.apIndex]
        }, this._bindPolls)

        console.log('... to active polls: ', activePolls)

        return activePolls[0].Id;
      }
    }

    this.setState({
      activePolls: [],
      currentPoll: {}
    }, this._bindPolls)

    return '';
  }

  public _bindPolls = (): void => {
    this.setState({
      showProgress: (this.state.polls.length > 0) ? true : false,
      enableSubmit: false,

      showOptions: false,
      showChart: false,
      showChartProgress: false,
      PollAnalytics: undefined,
      showMessage: false,
      isError: false,
      MsgContent: "",
      showSubmissionProgress: false
    }, this._getUserResponses)
  }

  public _getUserResponses = async (): Promise<void> => {
    const usersResponses = await UserPollService.igetPollResponses((this.state.currentPoll.Id) ? this.state.currentPoll.Id : this.disQuestionId);

    console.log('Getting them URs: ', usersResponses)
    /* Check if the user has already submitted a response to the current poll */
    const fillResponses = _.filter(usersResponses, (uR) => { return uR.UserEmail.toLowerCase() === this.props.currentUserInfo.Email.toLowerCase(); })

    console.log('GUR: ', fillResponses)
    if (fillResponses.length > 0) {
      /* Show chart results */
      this.setState({
        showChartProgress: true,
        showChart: true,
        showOptions: false,
        showProgress: false,
        pollResponse: usersResponses,
        currentPollResponse: fillResponses[0].PollResponse
      }, this._bindResponseAnalytics)
    } else {
      /* Continue to show poll and options */
      this.setState({
        showProgress: false,
        showOptions: true,
        showChartProgress: false,
        showChart: false
      });
    }
  }

  public _bindResponseAnalytics = (): void => {
    const { currentPoll } = this.state;
    const tmpUserResponse: any = this.state.pollResponse;

    /* Check that response exists */
    if (tmpUserResponse && tmpUserResponse.length > 0) {
      const pChoices: string[] = currentPoll.Choices.split(',');
      const finalData: any[] = [];

      const tempData: any = _.countBy(tmpUserResponse, 'PollResponse')

      pChoices.map((label) => {
        if (tempData[label.trim()] === undefined) {
          finalData.push(0);
        } else finalData.push(tempData[label.trim()]);
      });

      const pollAnalytics: IPollAnalyticsInfo = {
        ChartType: this.props.chartType,
        Labels: pChoices,
        Question: currentPoll.DisplayName,
        PollResponse: finalData
      };

      console.log('Show Poll analytics!: ', pollAnalytics)

      this.setState({
        showProgress: false,
        showOptions: false,
        showChartProgress: false,
        showChart: true,
        PollAnalytics: pollAnalytics
      })
    }
  }


  public _checkSubmitted = async (poll: any): Promise<boolean> => {
    /* Has the user already voted in this particular poll? */
    const voted = await UserPollService.checkSubmitted(poll.id)
    return voted
  }


  public render(): React.ReactElement<IPollManagementProps> {
    const showConfig = false
    return (
      <div className={styles.pollManagement}>
        <>
          {this.state.activePolls.length === 0 &&
            <Placeholder iconName='Edit'
              iconText={'Configure poll'}
              description={'No active polls available'}
              buttonLabel={'Configure poll'}
              onConfigure={this.props.openPropertyPane}
            />
          }
          {this.state.showProgress && !this.state.showChart &&
            <ProgressIndicator label={strings.QuestionLoadingText} description={strings.PlsWait} />
          }
          {!this.state.currentPoll && !showConfig &&
            <MessageContainer MessageScope={MessageScope.Info} Message={'No poll'} />
          }
          {this.state.showOptions && this.state.currentPoll &&
            <div className="ms-Grid" dir="ltr">
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg12 ms-md12 ms-sm12">
                  <div className="ms-textAlignLeft ms-font-m-plus ms-fontWeight-semibold">
                    {this.state.currentPoll.DisplayName}
                  </div>
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg12 ms-md12 ms-sm12">
                  <div className="ms-textAlignLeft ms-font-m-plus ms-fontWeight-semibold">
                    <OptionsContainer disabled={!this.state.enableChoices}
                      selectedKey={this._getSelectedKey}
                      options={this.state.currentPoll.Choices}
                      label="Pick One"
                      onChange={this._onChange}
                    />
                  </div>
                </div>
              </div>
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-lg12 ms-md12 ms-sm12">
                  <div className="ms-textAlignCenter ms-font-m-plus ms-fontWeight-semibold">
                    <PrimaryButton disabled={!this.state.enableSubmit} text={'Submit'}
                      onClick={this._submitVote.bind(this)} />
                  </div>
                </div>
              </div>
              {this.state.showSubmissionProgress && !this.state.showChartProgress &&
                <ProgressIndicator label={strings.SubmissionLoadingText} description={strings.PlsWait} />
              }
            </div>
          }
          {this.state.showMessage && this.state.MsgContent &&
            <MessageContainer MessageScope={(this.state.isError) ? MessageScope.Failure : MessageScope.Success} Message={this.state.MsgContent} />
          }
          {this.state.showChartProgress && !this.state.showChart &&
            <ProgressIndicator label="Loading the Poll analytics" description="Getting all the responses..." />
          }
          {this.state.showChart &&
            <>
              <QuickPollChart PollAnalytics={this.state.PollAnalytics} />
              <MessageContainer MessageScope={MessageScope.Info} Message={`${'Caption'}: ${this.state.currentPollResponse}`} />
            </>
          }
        </>
      </div>
    );
  }
}