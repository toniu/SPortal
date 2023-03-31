/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import styles from '../GroupManagement/GroupManagement.module.scss';
import { INewGroupProps } from './INewGroupProps';
import { INewGroupState } from './INewGroupState';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { PeoplePicker, PrincipalType, IPeoplePickerUserItem } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { MessageBar, MessageBarType, IStackProps, Stack, ActionButton, IIconProps, DefaultButton } from 'office-ui-fabric-react';
import UserGroupService from '../../../../services/UserGroupService';

const backIcon: IIconProps = { iconName: 'NavigateBack' };

/**
 * Custom styling of stack props
 */
const verticalStackProps: IStackProps = {
    styles: { root: { overflow: 'hidden', width: '100%' } },
    tokens: { childrenGap: 20 }
};

/**
 * The component for the new group
 */
export default class NewGroup extends React.Component<INewGroupProps, INewGroupState> {

    constructor(props: INewGroupProps) {
        super(props);

        this.state = {
            name: '',
            description: '',
            visibility: 'Public',
            owners: [],
            members: [],
            showMessageBar: false
        };
    }

    /**
     * The render
     * @returns The JSX element
     */
    public render(): React.ReactElement<INewGroupProps> {
        return (
            <div className={styles.groupManagement}>
                <div className={styles.container}>

                    <div className={styles.row}>
                        <div className={styles.headerStyle}>
                            <h1 className={styles.headerMsgStyle}>
                                <span>Add New Group</span>
                                <ActionButton className={styles.newHeaderLinkStyle} iconProps={backIcon} allowDisabledFocus onClick={this.props.returnToMainPage}>
                                    Back to listing
                                </ActionButton>
                            </h1>
                        </div>

                        {
                            this.state.showMessageBar
                                ?
                                <div className="form-group">
                                    <Stack {...verticalStackProps}>
                                        <MessageBar messageBarType={this.state.messageType}>{this.state.message}</MessageBar>
                                    </Stack>
                                </div>
                                :
                                null
                        }

                        <div className="form-group">
                            <TextField label="Name" required onChange={this.onchangedName} />
                        </div>

                        <div className="form-group">
                            <TextField label="Description" required multiline rows={3} onChange={this.onchangedDescription} />
                        </div>

                        <div className="form-group">
                            <Label required={true}>Visibility</Label>
                            <ChoiceGroup
                                defaultSelectedKey="Public"
                                options={[
                                    {
                                        key: 'Public',
                                        text: 'Public - Anyone can see group content'
                                    },
                                    {
                                        key: 'Private',
                                        text: 'Private - Only members can see group content'
                                    }
                                ]}
                                onChange={this.onChangeVisibility}
                            />
                        </div>

                        <div className="form-group">
                            <PeoplePicker
                                context={this.props.context as any}
                                titleText="Owners"
                                personSelectionLimit={3}
                                showHiddenInUI={false}
                                principalTypes={[PrincipalType.User]}
                                onChange={this._getPeoplePickerOwners.bind(this)}
                                required={true} />
                        </div>

                        <div className="form-group">
                            <PeoplePicker
                                context={this.props.context as any}
                                titleText="Members"
                                personSelectionLimit={3}
                                showHiddenInUI={false}
                                principalTypes={[PrincipalType.User]}
                                onChange={this._getPeoplePickerMembers}
                                required={true} />
                        </div>

                        <div className={`${styles.buttonRow} form-group`}>
                            <DefaultButton text="Submit" onClick={this.createNewGroup} />
                            &nbsp; &nbsp;
                            <DefaultButton text="Cancel" onClick={this.props.returnToMainPage} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * On changed selected owners - retrieve the emails of currently selected owners
     * @param items the people picker list of owners
     */
    private _getPeoplePickerOwners = (items: IPeoplePickerUserItem[]) => {
        console.log('People picker owners: ', items)
        this.setState(() => {
            return {
                ...this.state,
                owners: items.map(x => x.id.replace('i:0#.f|membership|', ''))
            };
        });
    }

    /**
     * On changed selected owners - retrieve the emails of currently selected owners
     * @param items the people picker list of members
     */
    private _getPeoplePickerMembers = (items: IPeoplePickerUserItem[]) => {
        console.log('People picker members: ', items)
        this.setState(() => {
            return {
                ...this.state,
                members: items.map(x => x.id.replace('i:0#.f|membership|', ''))
            };
        });
    }

    /**
     * Event fired for changed name text field
     * @param groupName new group name
     */
    private onchangedName = (groupName: any) => {
        this.setState({ name: groupName.target.value });
    }

    /**
     * Event fired for changed description text field
     * @param groupDescription new group description
     */
    private onchangedDescription = (groupDescription: any) => {
        this.setState({ description: groupDescription.target.value });
    }

    /**
     * Event fired for changed visibility (check-box changed)
     * @param ev the event of input element
     * @param option the new option chosen
     */
    private onChangeVisibility = (ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption) => {
        this.setState({ visibility: option.key });
    }

    /**
     * Calls service to create a new group, uses current state of inputs as the new group's details
     */
    private createNewGroup = () => {
        try {
            UserGroupService.createGroup(this.state.name, this.state.description, this.state.visibility, this.state.owners, this.state.members).catch(e => this.handleGroupError(e));

            this.setState({
                message: "Group " + this.state.name + " is created successfully!",
                showMessageBar: true,
                messageType: MessageBarType.success
            });
        } catch (error) {
            this.handleGroupError(error)
        }
    }

    /**
     * Handles the error from submitting form
     * @param error 
     */
    private handleGroupError = (error: string) => {
        this.setState({
            message: "Group " + this.state.name + " creation failed with error: " + error,
            showMessageBar: true,
            messageType: MessageBarType.error
        });
    }
}