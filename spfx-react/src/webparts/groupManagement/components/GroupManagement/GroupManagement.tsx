/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import styles from './GroupManagement.module.scss';
import { IGroupManagementProps } from './IGroupManagementProps';
import { IGroupManagementState } from './IGroupManagementState';
import UserGroupService from '../../../../services/UserGroupService';
import GroupList from '../GroupList/GroupList';
import NewGroup from "../NewGroup/NewGroup";
import { ActionButton, IIconProps } from 'office-ui-fabric-react';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';

const addGroupIcon: IIconProps = { iconName: 'AddGroup' };

export default class GroupManagement extends React.Component<IGroupManagementProps, IGroupManagementState> {
  constructor(props: IGroupManagementProps) {
    super(props);

    this.state = {
      isLoading: true,
      groups: [],
      ownerGroups: [],
      memberGroups: [],
      showNewGroupScreen: false,
      loadCount: 0
    };
  }

  public render(): React.ReactElement<IGroupManagementProps> {
    return (
      <div className={styles.groupManagement}>
        <div className={styles.container}>
          <div className={styles.row}>
            {
              this.state.loadCount === 3 && !this.state.showNewGroupScreen
                ?
                <p>
                  <h1 className={styles.headerMsgStyle}>Group management</h1>
                  <GroupList flowUrl={this.props.flowUrl} items={this.state.groups} ownerGroups={this.state.ownerGroups} memberGroups={this.state.memberGroups} context={this.props.context}/>
                  <br />
                  <ActionButton className={styles.newHeaderLinkStyle} iconProps={addGroupIcon} allowDisabledFocus onClick={this.showNewGroupScreen}>
                    New Group
                  </ActionButton>
                </p>
                :
                !this.state.showNewGroupScreen &&
                <Spinner label="Loading Groups..." />
            }
            {
              this.state.showNewGroupScreen &&
              <div>
                <div className={styles.row}>
                  <div className={styles.headerStyle}>
                    <NewGroup returnToMainPage={this.showMainScreen} context={this.props.context} />
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }

  public showNewGroupScreen = () => {
    this.setState(() => {
      return {
        ...this.state,
        showNewGroupScreen: true,
        showSelectedGroupScreen: false
      };
    });

    this.forceUpdate()
  }

  public showMainScreen = () => {
    this.setState(() => {
      return {
        ...this.state,
        showNewGroupScreen: false,
        showSelectedGroupScreen: false
      };
    });

    this.forceUpdate()
  }

  public componentDidMount(): void {
    this._getGroups();
  }

  public _getGroups = (): void => {
    UserGroupService.getGroups().then(groups => {
      console.log('Get groups: ', groups);

      this.setState({
        isLoading: false,
        groups: groups,
        loadCount: this.state.loadCount + 1
      });

      UserGroupService.getMyOwnerGroups(groups, 'me').then(groups => {
        console.log('Get owner groups: ', groups);
        this.setState({
          ownerGroups: groups.map((item: { id: any; }) => item.id),
          loadCount: this.state.loadCount + 1
        });
      }).catch((e: any) => console.log(e));

      UserGroupService.getMyMemberGroups(groups, 'me').then(groups => {
        console.log('Get member groups: ', groups);
        this.setState({
          memberGroups: groups.map(item => item.id),
          loadCount: this.state.loadCount + 1
        });
      }).catch((e: any) => console.log(e));
    }).catch((e: any) => console.log(e));
  }
}