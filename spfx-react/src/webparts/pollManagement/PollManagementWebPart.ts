/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
    IPropertyPaneConfiguration,
    PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { CalloutTriggers } from '@pnp/spfx-property-controls/lib/PropertyFieldHeader';
import { PropertyFieldToggleWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldToggleWithCallout';
import { PropertyFieldChoiceGroupWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldChoiceGroupWithCallout';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import { DateTimePicker, DateConvention } from '@pnp/spfx-controls-react/lib/DateTimePicker';
import "@pnp/polyfill-ie11";
import * as strings from 'PollManagementWebPartStrings';
import PollManagement from './components/PollManagement';
import { IPollManagementProps } from './components/IPollManagementProps';
import UserPollService from '../../services/UserPollService';
import { IUserInfo } from './models';
import { ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import '../../../assets/dist/tailwind.css';


export interface IPollManagementWebPartProps {
    pollQuestions: any[];
    MsgAfterSubmission: string;
    BtnSubmitVoteText: string;
    chartType: ChartType;
    ResponseMsgToUser: string;
    pollBasedOnDate: boolean;
    NoPollMsg: string;
}

export default class PollManagementWebPart extends BaseClientSideWebPart<IPollManagementWebPartProps> {
    private userinfo: IUserInfo = null;
    private initialPolls: any[];

    protected async onInit(): Promise<void> {
      return super.onInit().then(async () => {
        await UserPollService.setup(this.context);
        this.userinfo = await UserPollService.getCurrentUserInfo();

        this.initialPolls = await this.getInitialPolls();
      }).catch((e) => console.log(e));
    }

    public render(): void {
        const element: React.ReactElement<IPollManagementProps> = React.createElement(
            PollManagement,
            {
                initialQuestions: this.initialPolls,
                pollQuestions: this.properties.pollQuestions,
                SuccessfullVoteSubmissionMsg: this.properties.MsgAfterSubmission,
                ResponseMsgToUser: this.properties.ResponseMsgToUser,
                BtnSubmitVoteText: this.properties.BtnSubmitVoteText,
                chartType: this.properties.chartType ? this.properties.chartType : ChartType.Doughnut,
                pollBasedOnDate: this.properties.pollBasedOnDate,
                NoPollMsg: this.properties.NoPollMsg,
                currentUserInfo: this.userinfo,
                openPropertyPane: this.openPropertyPane
            }
        );

        ReactDom.render(element, this.domElement);
    }

    protected get disableReactivePropertyChanges(): boolean {
        return false;
    }

    protected onDispose(): void {
        ReactDom.unmountComponentAtNode(this.domElement);
    }

    protected get dataVersion(): Version {
        return Version.parse('1.0');
    }

    private openPropertyPane = async (): Promise<void> => {
        this.context.propertyPane.open();
    }

    private getInitialPolls = async (): Promise<any> => {
        /* Get polls */
        const polls = await UserPollService.igetPolls();
        console.log('Polls in webpart: ', polls)

        const ownerPolls = polls.filter((poll: any) => poll.Owner.toLowerCase() === this.userinfo.Email.toLowerCase())
        console.log('My polls in webpart: ', ownerPolls)

        const pollAsProps: any = []
        for (let i = 0; i < ownerPolls.length; i++) {
            pollAsProps.push({
                uniqueId: ownerPolls[i].Id,
                QEndDate: ownerPolls[i].EndDate,
                QOptions: ownerPolls[i].Choices,
                QStartDate: ownerPolls[i].StartDate,
                QTitle: ownerPolls[i].DisplayName,
                /* SP List Context: visibility: 'Public' -> true; 'Private' -> false */
                QVisibility: ownerPolls[i].Visibility !== null ? (ownerPolls[i].Visibility === 'Public' ? true : false ) : false,
                QDisabled: true,
                sortIdx: (i + 1)
            })
        }
        /* Set as values */
        console.log('Current questions props: ', pollAsProps)

        const initialPollProps: IPollManagementWebPartProps = this.properties
        initialPollProps.pollQuestions = pollAsProps
        
        return pollAsProps
    }

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyFieldToggleWithCallout('pollBasedOnDate', {
                                    calloutTrigger: CalloutTriggers.Hover,
                                    key: 'pollBasedOnDateFieldId',
                                    label: strings.PollDateLabel,
                                    calloutContent: React.createElement('div', {}, strings.PollDateCalloutText),
                                    onText: 'Yes',
                                    offText: 'No',
                                    checked: this.properties.pollBasedOnDate
                                }),
                                PropertyFieldCollectionData("pollQuestions", {
                                    key: "pollQuestions",
                                    label: strings.PollQuestionsLabel,
                                    panelHeader: strings.PollQuestionsPanelHeader,
                                    manageBtnLabel: strings.PollQuestionsManageButton,
                                    enableSorting: true,
                                    value: this.properties.pollQuestions,
                                    fields: [
                                        {
                                            id: "QTitle",
                                            title: strings.Q_Title_Title,
                                            type: CustomCollectionFieldType.custom,
                                            required: true,
                                            onCustomRender: (field, value, onUpdate, item, itemId) => {
                                                return (
                                                    React.createElement("div", null,
                                                        React.createElement("textarea",
                                                            {
                                                                style: { width: "220px", height: "70px" },
                                                                placeholder: strings.Q_Title_Placeholder,
                                                                key: itemId,
                                                                value: value,
                                                                disabled: item.QDisabled ?  item.QDisabled : false,
                                                                onChange: (event: React.FormEvent<HTMLTextAreaElement>) => {
                                                                    onUpdate(field.id, event.currentTarget.value);
                                                                },
                                                            })
                                                    )
                                                );
                                            }
                                        },
                                        {
                                            id: "QOptions",
                                            title: strings.Q_Options_Title,
                                            type: CustomCollectionFieldType.custom,
                                            required: true,
                                            onCustomRender: (field, value, onUpdate, item, itemId) => {
                                                return (
                                                    React.createElement("div", null,
                                                        React.createElement("textarea",
                                                            {
                                                                style: { width: "220px", height: "70px" },
                                                                placeholder: strings.Q_Options_Placeholder,
                                                                key: itemId,
                                                                value: value,
                                                                disabled: item.QDisabled ?  item.QDisabled : false,
                                                                onChange: (event: React.FormEvent<HTMLTextAreaElement>) => {
                                                                    onUpdate(field.id, event.currentTarget.value);
                                                                },
                                                            })
                                                    )
                                                );
                                            }
                                        },
                                        {
                                            id: "QVisibility",
                                            title: strings.Q_Visibility_Title,
                                            type: CustomCollectionFieldType.boolean,
                                            defaultValue: false,

                                        },
                                        {
                                            id: "QStartDate",
                                            title: strings.Q_StartDate_Title,
                                            type: CustomCollectionFieldType.custom,
                                            required: false,
                                            onCustomRender: (field, value, onUpdate, item, itemId) => {
                                                return (
                                                    React.createElement(DateTimePicker, {
                                                        key: itemId,
                                                        showLabels: false,
                                                        dateConvention: DateConvention.Date,
                                                        showGoToToday: true,
                                                        showMonthPickerAsOverlay: true,
                                                        value: value ? new Date(value) : null,
                                                        disabled: !this.properties.pollBasedOnDate,
                                                        onChange: (date: Date) => {
                                                            onUpdate(field.id, date);
                                                        }
                                                    })
                                                );
                                            }
                                        },
                                        {
                                            id: "QEndDate",
                                            title: strings.Q_EndDate_Title,
                                            type: CustomCollectionFieldType.custom,
                                            required: false,
                                            onCustomRender: (field, value, onUpdate, item, itemId) => {
                                                return (
                                                    React.createElement(DateTimePicker, {
                                                        key: itemId,
                                                        showLabels: false,
                                                        dateConvention: DateConvention.Date,
                                                        showGoToToday: true,
                                                        showMonthPickerAsOverlay: true,
                                                        value: value ? new Date(value) : null,
                                                        disabled: !this.properties.pollBasedOnDate,
                                                        onChange: (date: Date) => {
                                                            onUpdate(field.id, date);
                                                        }
                                                    })
                                                );
                                            }
                                        }
                                    ],
                                    disabled: false
                                }),
                                PropertyPaneTextField('MsgAfterSubmission', {
                                    label: strings.MsgAfterSubmissionLabel,
                                    description: strings.MsgAfterSubmissionDescription,
                                    maxLength: 150,
                                    multiline: true,
                                    rows: 3,
                                    resizable: false,
                                    placeholder: strings.MsgAfterSubmissionPlaceholder,
                                    value: this.properties.MsgAfterSubmission
                                }),
                                PropertyPaneTextField('ResponseMsgToUser', {
                                    label: strings.ResponseMsgToUserLabel,
                                    description: strings.ResponseMsgToUserDescription,
                                    maxLength: 150,
                                    multiline: true,
                                    rows: 3,
                                    resizable: false,
                                    placeholder: strings.ResponseMsgToUserPlaceholder,
                                    value: this.properties.ResponseMsgToUser
                                }),
                                PropertyPaneTextField('BtnSubmitVoteText', {
                                    label: strings.BtnSumbitVoteLabel,
                                    description: strings.BtnSumbitVoteDescription,
                                    maxLength: 50,
                                    multiline: false,
                                    resizable: false,
                                    placeholder: strings.BtnSumbitVotePlaceholder,
                                    value: this.properties.BtnSubmitVoteText
                                }),
                                PropertyPaneTextField('NoPollMsg', {
                                    label: strings.NoPollMsgLabel,
                                    description: strings.NoPollMsgDescription,
                                    maxLength: 150,
                                    multiline: true,
                                    rows: 3,
                                    resizable: false,
                                    placeholder: strings.NoPollMsgPlaceholder,
                                    value: this.properties.NoPollMsg
                                }),
                                PropertyFieldChoiceGroupWithCallout('chartType', {
                                    calloutContent: React.createElement('div', {}, strings.ChartFieldCalloutText),
                                    calloutTrigger: CalloutTriggers.Hover,
                                    key: 'choice_charttype',
                                    label: strings.ChartFieldLabel,
                                    options: [
                                        {
                                            key: 'pie',
                                            text: 'Pie',
                                            checked: this.properties.chartType === ChartType.Pie,
                                            iconProps: { officeFabricIconFontName: 'PieSingle' }
                                        }, {
                                            key: 'doughnut',
                                            text: 'Doughnut',
                                            checked: this.properties.chartType === ChartType.Doughnut,
                                            iconProps: { officeFabricIconFontName: 'DonutChart' }
                                        }, {
                                            key: 'bar',
                                            text: 'Bar',
                                            checked: this.properties.chartType === ChartType.Bar,
                                            iconProps: { officeFabricIconFontName: 'BarChartVertical' }
                                        }, {
                                            key: 'horizontalBar',
                                            text: 'Horizontal Bar',
                                            checked: this.properties.chartType === ChartType.HorizontalBar,
                                            iconProps: { officeFabricIconFontName: 'BarChartHorizontal' }
                                        }, {
                                            key: 'line',
                                            text: 'Line',
                                            checked: this.properties.chartType === ChartType.Line,
                                            iconProps: { officeFabricIconFontName: 'LineChart' }
                                        }]
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}