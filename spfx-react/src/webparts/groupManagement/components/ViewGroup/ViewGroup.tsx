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
import { MessageBar, IStackProps, Stack, ActionButton, IIconProps, DefaultButton } from 'office-ui-fabric-react';

const backIcon: IIconProps = { iconName: 'NavigateBack' };

const verticalStackProps: IStackProps = {
    styles: { root: { overflow: 'hidden', width: '100%' } },
    tokens: { childrenGap: 20 }
};

export default class ViewGroup extends React.Component<IViewGroupProps, IViewGroupState> {

    constructor(props: IViewGroupProps) {
        super(props);

        this.state = {
            name: props.selectedGroup.displayName,
            description: props.selectedGroup.description,
            visibility: props.selectedGroup.visibility,
            originalOwners: props.selectedGroup.originalOwners,
            originalMembers: props.selectedGroup.originalMembers,
            showMessageBar: false
        };
    }

    public render(): React.ReactElement<IViewGroupProps> {
        return (
            <div className={styles.groupManagement}>
                <div className={styles.container}>

                    <div className={styles.row}>
                        <div className={styles.headerStyle}>
                            <h1 className={styles.headerMsgStyle}>
                                <span>{this.state.name}</span>
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

    private _getPeoplePickerOwners = (items: IPeoplePickerUserItem[]) => {
        console.log('People picker owners: ', items)
        this.setState(() => {
            return {
                ...this.state,
                owners: items.map(x => x.id.replace('i:0#.f|membership|', ''))
            };
        });
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

    private createNewGroup = () => {
        console.log('temp')
    }
}