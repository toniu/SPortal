/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import styles from '../GroupManagement/GroupManagement.module.scss';
import { IViewGroupProps } from './IViewGroupProps';
import { IViewGroupState } from './IViewGroupState';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { PeoplePicker, PrincipalType, IPeoplePickerUserItem } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { MessageBar, IStackProps, Stack, ActionButton, IIconProps, DefaultButton, MessageBarType } from 'office-ui-fabric-react';
import UserGroupService from '../../../../services/UserGroupService';
/* Tailwind import */
import '../../../../../assets/dist/tailwind.css';

const backIcon: IIconProps = { iconName: 'NavigateBack' };
import { Icon } from 'office-ui-fabric-react/lib/Icon';

const verticalStackProps: IStackProps = {
    styles: { root: { overflow: 'hidden', width: '100%' } },
    tokens: { childrenGap: 20 }
};

export default class ViewGroup extends React.Component<IViewGroupProps, IViewGroupState> {

    constructor(props: IViewGroupProps) {
        super(props);

        this.state = {
            id: props.selectedGroup.id,
            spId: props.selectedGroup.spId,
            name: props.selectedGroup.name,
            description: props.selectedGroup.description,
            visibility: props.selectedGroup.visibility,
            owners: props.selectedGroup.owners,
            members: props.selectedGroup.members,
            showMessageBar: false,
            /* Save original items to compare with new changes later */
            originalState: props.selectedGroup
        };

        console.log('View this group (original state): ', this.state)
        this.forceUpdate()
    }


    public render(): React.ReactElement<IViewGroupProps> {

        /* Original state: the original owners and members of the group */
        const origOwners = this.state.originalState.owners
        const origMembers = this.state.originalState.members

        console.log('When rendering, the original owners are...', origOwners, origOwners.length)
        console.log('When rendering, the original members are...', origMembers, origMembers.length)

        /* JSX element to render current owners of group */
        const renderedOwners = origOwners.map((owner: any) => <li key={owner.email} className="flex">
            <Icon className="mx-2 text-base" iconName='PartyLeader' />
            <span className="mx-2 text-base"> {owner.firstName} {owner.lastName} </span>
        </li>)
        console.log('When rendering, member emails: ', renderedOwners)

        /* Default People picker: current members of group */
        let memberEmails: string[] = []
        memberEmails = []
        for (let i = 0; i < origMembers.length; i++) {
            if (origMembers[i]) {
                memberEmails.push(origMembers[i].email)
            }
        }
        console.log('When rendering, member emails: ', memberEmails)

        return (
            <div className={styles.groupManagement}>
                <div className={styles.container}>

                    <div className={styles.row}>
                        <div className={styles.headerStyle}>
                            <h1 className={styles.headerMsgStyle}>
                                <span className="font-semibold">
                                    <Icon className="mx-3 text-base" iconName='Group' />
                                    {this.state.originalState.name}
                                </span>
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
                            <TextField label="Name" placeholder={this.state.originalState.name} required onChange={this.onchangedName} />
                        </div>

                        <div className="form-group">
                            <TextField label="Description" placeholder={this.state.originalState.description} required multiline rows={3} onChange={this.onchangedDescription} />
                        </div>

                        <div className="form-group">
                            <Label required={true}>Visibility</Label>
                            <ChoiceGroup
                                defaultSelectedKey={this.state.originalState.visibility}
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
                            <Label>Owners</Label>
                            <ul>
                                {renderedOwners}
                            </ul>
                        </div>


                        <div className="form-group">
                            <PeoplePicker
                                context={this.props.context as any}
                                titleText="Members"
                                personSelectionLimit={15}
                                defaultSelectedUsers={memberEmails}
                                showHiddenInUI={false}
                                principalTypes={[PrincipalType.User]}
                                onChange={this._getPeoplePickerMembers}
                                required={true} />
                        </div>

                        <div className={`${styles.buttonRow} form-group`}>
                            <DefaultButton text="Save changes" onClick={this.updateGroup} />
                            &nbsp; &nbsp;
                            <DefaultButton text="Discard changes" onClick={this.props.returnToMainPage} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private _getPeoplePickerMembers = (items: IPeoplePickerUserItem[]) => {
        console.log('People picker members: ', items)
        this.setState(() => {
            return {
                ...this.state,
                members: items.map(x => x.id.replace('i:0#.f|membership|', ''))
            };
        });
    }

    private onchangedName = (groupName: any) => {
        this.setState({ name: groupName.target.value });
    }

    private onchangedDescription = (groupDescription: any) => {
        this.setState({ description: groupDescription.target.value });
    }

    private onChangeVisibility = (ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption) => {
        this.setState({ visibility: option.key });
    }

    private updateGroup = () => {
        console.log('Save changes to state: ', this.state)

        try {
            let success = true;
            let errorMessage = '';

            /* Before and after member list of changes */
            const membersBefore = this.state.originalState.members
            const membersAfter = this.state.members

            /* The members to add and/or remove from the group based on saved changes */
            const membersToAdd = membersAfter.filter((m: any) => membersBefore.indexOf(m) < 0)
            const membersToRemove = membersBefore.filter((m: any) => membersAfter.indexOf(m) < 0)

            console.log('Members to add: ', membersToAdd)
            console.log('Members to remove: ', membersToRemove)

            /* Validation check */
            let newName = this.state.name
            let newDescription = this.state.description

            /* Validate name */
            if (this.state.name.trim().length === 0) {
                /* Keep name as the placeholder value */
                newName = this.state.originalState.name
            } else if (this.state.name.trim().length > 0 && this.state.name.trim().length < 3) {
                /* Error message: must be at least 3 characters */
                success = false
                errorMessage = 'Group name must be at least 3 characters!'
                this.setState({
                    message: "Group " + this.state.name + " update error: " + errorMessage,
                    showMessageBar: true,
                    messageType: MessageBarType.error
                });
            }

            /* Validate description */
            if (this.state.description.trim().length === 0) {
                /* Keep description as the placeholder value */
                newDescription = this.state.originalState.description
            } else if (this.state.description.trim().length > 0 && this.state.description.trim().length < 3) {
                /* Error message: must be at least 3 characters */
                success = false
                errorMessage = 'Description must be at least 3 characters!'
                this.setState({
                    message: "Group " + this.state.name + " update error: " + errorMessage,
                    showMessageBar: true,
                    messageType: MessageBarType.error
                });
            }

            /* Validate members */
            /* Check that there are no added members that are already 'owners' of the group */
            const ownerEmails = this.state.originalState.owners.map((m: any) => m.email)
            const includesOwners = this.state.members.filter(m => ownerEmails.indexOf(m) >= 0)
            if (includesOwners.length > 0) {
                /* Error message: cannot add members that are already owners of group */
                success = false
                errorMessage = 'Cannot have members that are already owners of the group!'
                this.setState({
                    message: "Group " + this.state.name + " update error: " + errorMessage,
                    showMessageBar: true,
                    messageType: MessageBarType.error
                });
            }

            /* Valid changes */
            if (success) {
                console.log('UG State before updating: ', this.state)
                UserGroupService.editGroupDetails(this.state.spId, this.state.id, newName, newDescription, this.state.visibility, membersToAdd, membersToRemove).catch(e => this.handleGroupError(e));

                this.setState({
                    message: "Group " + this.state.name + " is updated successfully!",
                    showMessageBar: true,
                    messageType: MessageBarType.success
                });
            }

        } catch (error) {
            this.handleGroupError(error)
        }

    }

    private handleGroupError = (error: string) => {
        this.setState({
            message: "Group " + this.state.name + " update request failed with error: " + error,
            showMessageBar: true,
            messageType: MessageBarType.error
        });
    }
}