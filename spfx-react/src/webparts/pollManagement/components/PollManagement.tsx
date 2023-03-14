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
      ownerPolls: [],
      isLoading: true,
      loadCount: 0,
      currentPoll: {},
      activePolls: [],
      apIndex: 0,
      pollResponse: [],

      /* -- */
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

    this.disQuestionId = ''
    this.displayQuestion = null
    console.log( this.disQuestionId,this.displayQuestion)
  }

  public componentDidMount = async (): Promise<void> => {
    await this._getPolls();
  }

  public _onChange = (ev: any, option: any, isMultiSel: boolean): void => {
    const prevUserResponse = this.state.pollResponse;

    const userResponse: IResponseDetails = {
      QuestionID: this.state.currentPoll.Id,
      UserEmail: this.props.currentUserInfo.Email,
      PollResponse: ''
    }

    if (prevUserResponse.length > 0) {
      const fillRes = this._getUserResponse(prevUserResponse);
      if (fillRes.length > 0) {
        fillRes[0].PollResponse = option.key
      } else {
        prevUserResponse.push(userResponse)
      }
    } else {
      prevUserResponse.push(userResponse)
    }

    this.setState({
      ...this.state,
      pollResponse: prevUserResponse
    });
  }

  private _getSelectedKey = (): string => {
    let selKey: string = "";
    if (this.state.pollResponse && this.state.pollResponse.length > 0) {
      const userResponses = this.state.pollResponse;
      const userRes = this._getUserResponse(userResponses);
      if (userRes.length > 0) {
        selKey = userRes[0].PollResponse;
      }
    }
    return selKey;
  }

  public _submitVote = (poll: any): void => {
    try {
      console.log('Submit with current state', this.state)
      //UserPollService.isubmitResponseToPoll(poll.id, this.state.pollResponse).catch((e: any) => console.log(e));
    } catch (e) {
      console.log(e)
    }
  }

  public _getUserResponse(userResponse: any): any {
    const retUR: IResponseDetails[] = userResponse.filter((res: any) => { return res.UserEmail === this.props.currentUserInfo.Email; });
    return retUR;
  }

  public _getPolls = async (): Promise<void> => {
    const userInfo = await UserPollService.getCurrentUserInfo()

    /* */

    /* */

    UserPollService.igetPolls().then(polls => {
      /* Set state code [...]: isLoading, polls, loadCount */
      console.log('Polls: ', polls)

      /* Only polls that are owned by the current user */
      
      /* Set default value of using date or not */
      for (let i = 0; i < polls.length; i++) {
        polls[i].UseDate = this.props.pollBasedOnDate
      }
      const ownerPolls = polls.filter((poll: any) => poll.Owner === userInfo.Email)

      console.log('Polls owned by YOU: ', ownerPolls)

      this.disQuestionId = this._checkActivePolls(ownerPolls)
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
      enableSubmit: true,

      showOptions: false,
      showChart: false,
      showChartProgress: false,
      PollAnalytics: undefined,
      showMessage: false,
      isError: false,
      MsgContent: "",
      showSubmissionProgress: false
    }, this._getUserReponses)
  }

  public _getUserReponses = async (): Promise<void> => {
    const usersResponses = await UserPollService.igetPollResponses((this.state.currentPoll.Id) ? this.state.currentPoll.Id : this.disQuestionId);
    
    /* Check if the user has already submitted a reesponse to the current poll */
    const fillResponses = _.filter(usersResponses, (o) => { return o.UserID === this.props.currentUserInfo.ID; })

    console.log('GUR: ', fillResponses)
    if (fillResponses.length > 0) {
      /* Show chart results */
      this.setState({
        showChartProgress: true,
        showChart: true,
        showOptions: false,
        showProgress: false,
        pollResponse: usersResponses
      })
    } else {
      /* Show poll and options */
      this.setState({
        showProgress: false,
        showOptions: true,
        showChartProgress: false,
        showChart: false
      });
    }
  }

  public bindResponseAnalytics = (): void => {
    const { currentPoll } = this.state;
    const tmpUserResponse: any = this.state.pollResponse;

    /* Check that response exists */
    if (tmpUserResponse && tmpUserResponse.length > 0) {
      const pChoices: string[] = currentPoll.Choices.split(',');
      const finalData: any[] = [];

      const tempData: any = _.countBy(tmpUserResponse, 'Response')

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