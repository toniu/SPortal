/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import styles from './GroupManagement.module.scss';
import { IGroupManagementProps } from './IGroupManagementProps';
import { IGroupManagementState } from './IGroupManagementState';
import O365GroupService from '../../../../services/O365GroupService';
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
      showEditGroupScreen: false,
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
                  <GroupList flowUrl={this.props.flowUrl} items={this.state.groups} ownerGroups={this.state.ownerGroups} memberGroups={this.state.memberGroups} />
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
        showNewGroupScreen: true
      };
    });
  }

  public showMainScreen = () => {
    this.setState(() => {
      return {
        ...this.state,
        showNewGroupScreen: false
      };
    });
  }

  public componentDidMount(): void {
    this._getGroups();
  }

  public _getGroups = (): void => {
    O365GroupService.getGroups().then(groups => {
      console.log('Get groups: ', groups);

      this.setState({
        isLoading: false,
        groups: groups,
        loadCount: this.state.loadCount + 1
      });

      O365GroupService.getMyOwnerGroups(groups).then(groups => {
        console.log('Get owner groups: ', groups);
        this.setState({
          ownerGroups: groups.map((item: { id: any; }) => item.id),
          loadCount: this.state.loadCount + 1
        });
      }).catch((e: any) => console.log(e));

      O365GroupService.getMyMemberGroups(groups).then(groups => {
        console.log('Get member groups: ', groups);
        this.setState({
          memberGroups: groups.map(item => item.id),
          loadCount: this.state.loadCount + 1
        });
      }).catch((e: any) => console.log(e));
    }).catch((e: any) => console.log(e));
  }
}