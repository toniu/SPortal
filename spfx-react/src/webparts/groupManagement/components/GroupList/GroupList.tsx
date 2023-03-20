/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import styles from '../GroupManagement/GroupManagement.module.scss';
import { IGroupListProps } from './IGroupListProps';
import { IGroupListState } from './IGroupListState';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton, DialogFooter, DialogType, Icon, IconButton, IIconProps, PrimaryButton } from 'office-ui-fabric-react';
import { TeachingBubble } from 'office-ui-fabric-react/lib/TeachingBubble';
import { DirectionalHint } from 'office-ui-fabric-react/lib/Callout';
import { AnimatedDialog } from "@pnp/spfx-controls-react/lib/AnimatedDialog";
import { List } from 'office-ui-fabric-react/lib/List';
import { ITheme, mergeStyleSets, getTheme, getFocusStyle } from 'office-ui-fabric-react/lib/Styling';
import { IGroup } from "../../models/IGroup";
import ViewGroup from "../ViewGroup/ViewGroup"
import UserGroupService from '../../../../services/UserGroupService';
/* Tailwind import */
import '../../../../../assets/dist/tailwind.css';

interface IGroupListClassObject {
  itemCell: string;
  itemImage: string;
  itemContent: string;
  itemName: string;
  itemIndex: string;
  chevron: string;
}

// Icons
const joinIcon: IIconProps = { iconName: 'Subscribe' };
const leaveIcon: IIconProps = { iconName: 'Unsubscribe' };
const manageIcon: IIconProps = { iconName: 'AccountManagement' };
const deleteIcon: IIconProps = { iconName: 'Delete' };

// List style
const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;

const classNames: IGroupListClassObject = mergeStyleSets({
  itemCell: [
    getFocusStyle(theme, { inset: -1 }),
    {
      minHeight: 54,
      padding: 10,
      boxSizing: 'border-box',
      borderBottom: `1px solid ${semanticColors.bodyDivider}`,
      display: 'flex',
      selectors: {
        '&:hover': { background: palette.neutralLight }
      }
    }
  ],
  itemImage: {
    flexShrink: 0
  },
  itemContent: {
    marginLeft: 10,
    overflow: 'hidden',
    flexGrow: 1
  },
  itemName: [
    fonts.xLarge,
    {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  ],
  itemIndex: {
    fontSize: fonts.small.fontSize,
    color: palette.neutralTertiary,
    marginBottom: 10
  },
  chevron: {
    alignSelf: 'center',
    marginLeft: 10,
    color: palette.neutralTertiary,
    fontSize: fonts.large.fontSize,
    flexShrink: 0
  }
});

export default class GroupList extends React.Component<IGroupListProps, IGroupListState> {
  private _originalItems: IGroup[];
  private _menuButtonElement: HTMLElement;

  constructor(props: IGroupListProps) {
    super(props);

    props.items.map(group => {
      let myUserRole: string = "";

      if (props.ownerGroups.indexOf(group.id) > -1) {
        myUserRole = "Owner";
      }
      else if (props.memberGroups.indexOf(group.id) > -1) {
        myUserRole = "Member";
      }

      group.userRole = myUserRole;
    });

    this._originalItems = props.items;

    this.state = {
      filterText: '',
      showDialog: false,
      selectedGroup: null,
      showSelectedGroup: false,
      isTeachingBubbleVisible: false,
      groups: this._originalItems
    };

    this._onRenderUserGroupCell = this._onRenderUserGroupCell.bind(this);
    this._onRenderExistingGroupCell = this._onRenderExistingGroupCell.bind(this);
    this._onDismiss = this._onDismiss.bind(this);
  }

  public render(): React.ReactElement<IGroupListProps> {
    const { groups = [] } = this.state;
    const resultCountText = groups.length === this._originalItems.length ? '' : ` (${groups.length} of ${this._originalItems.length} shown)`;

    return (
      <div className={styles.groupContainer}>
        {
          <AnimatedDialog
            hidden={!this.state.showDialog}
            onDismiss={() => { this.setState({ showDialog: false }); }}
            dialogContentProps={{ type: DialogType.normal, title: 'Delete group', subText: 'Confirmation to delete group?' }}
            modalProps={{ isDarkOverlay: true }}
            dialogAnimationInType='fadeInDown'
            dialogAnimationOutType='fadeOutDown'
          >
            <DialogFooter>
              <PrimaryButton onClick={() => { this._manageDeleteGroup(true) }} text="Yes" />
              <DefaultButton onClick={() => { this._manageDeleteGroup(false) }} text="No" />
            </DialogFooter>
          </AnimatedDialog>
        }
        {
          !this.state.showSelectedGroup &&
          <>
            <TextField label={'Filter by name' + resultCountText} onChange={this._onFilterChanged} />
            <FocusZone direction={FocusZoneDirection.vertical}>
              <div className="flex p-1">
                <div className="owner-groups p-2 w-1/2">
                  <h2 className="p-1 text-base text-black font-normal border-b-2 border-gray-400"> my groups </h2>
                  <List items={groups.filter(group => group.userRole === "Member" || group.userRole === "Owner")} onRenderCell={this._onRenderUserGroupCell} />
                </div>
                <div className="member-groups p-2 w-1/2">
                  <h2 className="p-1 text-base text-black font-normal border-b-2 border-gray-400"> existing groups </h2>
                  <List items={groups.filter(group => group.userRole === "")} onRenderCell={this._onRenderExistingGroupCell} />
                </div>
              </div>
              {this.state.isTeachingBubbleVisible ? (
                <div>
                  <TeachingBubble
                    calloutProps={{ directionalHint: DirectionalHint.bottomLeftEdge }}
                    isWide={true}
                    hasCloseButton={true}
                    closeButtonAriaLabel="Close"
                    target={this._menuButtonElement}
                    onDismiss={this._onDismiss}
                    headline="Manage O365 Groups"
                  >
                    {this.state.techingBubbleMessage}
                  </TeachingBubble>
                </div>
              ) : null}
            </FocusZone>
          </>
        }
        {
          this.state.showSelectedGroup &&
          <div>
            <div className={styles.row}>
              <div className={styles.headerStyle}>
                <ViewGroup returnToMainPage={this.mainPageGroups} selectedGroup={this.state.selectedGroup} context={this.props.context} />
              </div>
            </div>
          </div>
        }

      </div>
    );
  }

  public mainPageGroups = () => {
    this.setState(() => {
      return {
        ...this.state,
        selectedGroup: null,
        showSelectedGroup: false
      };
    });
  }


  private _onFilterChanged = (_: any, text: string): void => {
    this.setState({
      filterText: text,
      groups: text ? this._originalItems.filter(item => item.displayName.toLowerCase().indexOf(text.toLowerCase()) >= 0) : this._originalItems
    });

  }

  private _onRenderUserGroupCell(group: IGroup, index: number | undefined): JSX.Element {
    return (
      <div className={classNames.itemCell} data-is-focusable={true}>
        {
          group.userRole ==="Owner" &&
          <Icon className="p-1 m-1 text-xl" iconName='PartyLeader' />
        }
        {
          group.userRole ==="Member" &&
          <Icon className="p-1 m-1 text-xl" iconName='Group' />
        }
        <div className={classNames.itemContent}>
          <div className={classNames.itemIndex}>{group.visibility}</div>
          <div className="font-semibold">{group.displayName}</div>
        </div>
        {
          group.userRole === "Owner" &&
          <div className="flex">
            <IconButton iconProps={manageIcon} title="Manage Group" ariaLabel="Manage Group" onClick={async (event) => { await this._manageGroupClicked(group); }} />
            <IconButton iconProps={deleteIcon} title="Delete Group" ariaLabel="Delete Group" onClick={(event) => { this._deleteGroupClicked(group); }} />
          </div>
        }
        {
          group.userRole === "Member" &&
          <span className="ms-TeachingBubbleBasicExample-buttonArea" ref={menuButton => (this._menuButtonElement = menuButton!)}>
            <IconButton iconProps={leaveIcon} title="Leave Group" ariaLabel="Leave Group" onClick={(event) => { this._leaveGroupClicked(group.id, group.displayName); }} />
          </span>
        }
      </div>
    );
  }

  private _onRenderExistingGroupCell(group: IGroup, index: number | undefined): JSX.Element {
    return (
      <div className={classNames.itemCell} data-is-focusable={true}>
        <Icon className="p-1 m-1 text-xl" iconName='Group' />
        <div className={classNames.itemContent}>
          <div className={classNames.itemIndex}>{group.visibility}</div>
          <div>{group.displayName}</div>
        </div>
        {
          group.visibility === "Public" && group.userRole === "" &&
          <span className="ms-TeachingBubbleBasicExample-buttonArea" ref={menuButton => (this._menuButtonElement = menuButton!)}>
            <IconButton iconProps={joinIcon} title="Join Group" ariaLabel="Join Group" onClick={(event) => { this._joinGroupClicked(group.id, group.displayName); }} />
          </span>
        }
      </div>
    );
  }

  private _onDismiss(ev: any): void {
    this.setState({
      isTeachingBubbleVisible: false
    });
  }

  private _manageGroupClicked = async (group: any) => {
    console.log('Manage group selected', group)
    let members: any[] = []
    let owners: any[] = []

    /* Retrieve members and owners */
    members = await UserGroupService.getGroupUsers(group.id, 'members')
    owners = await UserGroupService.getGroupUsers(group.id, 'owners')

    /* Set new properties to pass as a prop into the React component used to edit/view group */
    const groupDetails = {
      id: group.id,
      spId: group.SPId,
      name: group.displayName,
      description: group.description,
      visibility: group.visibility,
      owners: owners,
      members: members
    }

    console.log('Group details from viewed group: ', groupDetails);

    await this.setState({
      selectedGroup: groupDetails,
      showSelectedGroup: true
    });

    this.forceUpdate()
  }

  private _deleteGroupClicked = (group: any) => {
    this.setState({
      selectedGroup: group,
      showDialog: true
    });

    this.forceUpdate()
  }

  private _manageDeleteGroup = (confirm: boolean) => {
    /* If option is yes */
    if (confirm) {
      const groupId = this.state.selectedGroup.id
      const groupName = this.state.selectedGroup.displayName
      UserGroupService.deleteGroup(groupId).then(response => {
        /* Filter out the deleted group */
        this._originalItems = this.state.groups.filter(group => group.id !== groupId)
        this.setState({
          groups: this._originalItems
        })

        /* Re-check groups with map function and show confirmation message */
        this.setState(prevState => ({
          groups: prevState.groups.map(group => group.id === groupId ? { ...group, userRole: "" } : group),
          isTeachingBubbleVisible: true,
          techingBubbleMessage: 'You have deleted group: ' + groupName
        }));

      }).catch(e => console.log(e));
    }

    /* Back to default: no group to delete now */
    this.setState({
      showDialog: false,
      selectedGroup: null
    });

    this.forceUpdate();
  }

  private _leaveGroupClicked = (groupId: string, groupName: string) => {
    UserGroupService.removeMembersFromGroup(groupId, 'me').then(response => {
      this.setState(prevState => ({
        groups: prevState.groups.map(group => group.id === groupId ? { ...group, userRole: "" } : group),
        isTeachingBubbleVisible: true,
        techingBubbleMessage: 'You have left the group: ' + groupName
      }));
    }).catch(e => console.log(e));

    this.forceUpdate();
  }

  private _joinGroupClicked = (groupId: string, groupName: string) => {
    UserGroupService.addMembersToGroup(groupId, 'me').then(response => {
      this.setState(prevState => ({
        groups: prevState.groups.map(group => group.id === groupId ? { ...group, userRole: "Member" } : group),
        isTeachingBubbleVisible: true,
        techingBubbleMessage: 'You have joined the group: ' + groupName
      }));
    }).catch(e => console.log(e));

    this.forceUpdate();
  }
}