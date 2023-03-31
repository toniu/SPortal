/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import { IProfileProps } from './IProfileProps';
/* Components */
import { IProfileState } from './IProfileState'
import { IUserProfile } from './IUserProfile'
/* Services */
import { IDataService } from '../../../services/IDataService';
import UserGroupService from '../../../services/UserGroupService';
import { UserProfileService } from '../../../services/UserProfileService';
import { ServiceScope } from '@microsoft/sp-core-library'
/* Icons */
import { Icon, IIconProps } from 'office-ui-fabric-react/lib/Icon';
import { ActionButton } from 'office-ui-fabric-react';

const userIcon: IIconProps = { iconName: 'Contact' };
const backIcon: IIconProps = { iconName: 'NavigateBack' };


/**
 * The interface for the user profile
 */
export class UserProfile implements IUserProfile {
  public Id: string;
  public FirstName: string;
  public LastName: string;
  public Email: string;
  public Title: string;
  public WorkPhone: string;
  public DisplayName: string;
  public Department: string;
  public PictureURL: string;
  public UserProfileProperties: Array<any>;
}

/**
 * The component for the profile; initial state and initial default profile
 */
export default class Profile extends React.Component<IProfileProps, IProfileState> {
  private dataCenterServiceInstance: IDataService;
  private defaultProfile: IUserProfile;

  constructor(props: IProfileProps) {
    super(props);

    this.defaultProfile = new UserProfile();
    this.defaultProfile.Id = "";
    this.defaultProfile.FirstName = "";
    this.defaultProfile.LastName = "";
    this.defaultProfile.Email = "";
    this.defaultProfile.Title = "";
    this.defaultProfile.WorkPhone = "";
    this.defaultProfile.DisplayName = "";
    this.defaultProfile.Department = "";
    this.defaultProfile.PictureURL = "";
    this.defaultProfile.UserProfileProperties = [];

    this.state = {
      loggedInUser: this.props.context.pageContext.user.loginName,
      currentUser: 'me',
      userProfileItems: this.defaultProfile,
      ownerGroups: [],
      memberGroups: [],
      usersToDiscover: []
    }
  }

  /**
   * When the component is mounted, get the user properties of current user,
   * their groups and suggested users to discover
   */
  public componentDidMount(): void {
    console.log('Mounted:', this.state)

    /* Call user properties when state has changed */
    this._getUserProperties(this.state.currentUser, false)
    /* Call current user's groups */
    this._getGroups(this.state.currentUser)
    /* Suggest some users to discover based on selected user's page */
    this._getUsersToDiscover(this.state.currentUser)

    this.forceUpdate()
  }

  /**
   * The render
   * @returns The JSX element
   */
  public render(): React.ReactElement<IProfileProps> {
    console.log('Rendering using state:', this.state)
    const renderOwnerGroups = this.state.ownerGroups.map((group: any) => <li key={group.id} className="m-1 p-1 flex bg-white border-l-4 border-cyan-600">
      <Icon className=" text-black text-base font-extrabold" iconName='PartyLeader' />
      <span className="mx-2 text-base"> {group.displayName} </span>
    </li>)

    const renderMemberGroups = this.state.memberGroups.map((group: any) => <li key={group.id} className="m-1 p-1 flex bg-white border-l-4 border-cyan-600">
      <Icon className=" text-black text-base font-extrabold" iconName='Group' />
      <span className="mx-2 text-base"> {group.displayName} </span>
    </li>)

    const renderUsersToDiscover = this.state.usersToDiscover.map((user: any) => <li key={user.Id} className="p-1 m-1 bg-white shadow-lg flex">
      <div className="w-1/4 text-lg mx-1 my-5 p-2">
        <span className="p-2 bg-gray-900 text-white font-semibold rounded-full">  {user.FirstName.charAt(0)}{user.LastName.charAt(0)} </span>
      </div>
      <div className="suggestion-name-details p-1 w-3/4">
        <h3 className="text-black font-semibold text-sm"> {user.FirstName} {user.LastName} </h3>
        <h4 className="py-1 text-black font-light text-xs"> {user.Department} </h4>
        <ActionButton className="text-sm" iconProps={userIcon} allowDisabledFocus onClick={() => this._clickNewProfile(user)}>
          view profile
        </ActionButton>
      </div>
    </li>)

    return (
      <div className="container p-1 flex">
        <div className="profile-box m-1 bg-gray-100 w-3/5">
          <div className="topbar flex p-3 bg-gray-900">
            <Icon className="mx-2 text-lg text-white font-bold" iconName='Contact' />
            <div className="profile-icon flex">
              <h1 className="name text-lg text-white font-semibold">
                {this.state.userProfileItems.FirstName} {this.state.userProfileItems.LastName}
              </h1>
            </div>
          </div>
          <div className="roles p-2">
            <h2 className="p-1 font-light text-lg">
              {this.state.userProfileItems.Title}
            </h2>
            <h3 className="p-1 font-semibold text-base">
              {this.state.userProfileItems.Department}
            </h3>
          </div>
          <div className="groups-box p-1 flex">
            <div className="groups p-1 w-1/2">
              <h3 className="p-2 text-base text-black font-semibold">
                owner groups
              </h3>
              <div className="bg-gray-900">
                {
                  this.state.ownerGroups.length > 0 &&
                  <ul className="groups-list p-1 overflow-y-scroll h-32">
                  {renderOwnerGroups}
                  </ul>      
                }
                {
                  this.state.ownerGroups.length === 0 &&
                  <div className="p-3 text-gray-300">
                    <Icon className="text-center my-2 block text-4xl" iconName='Group' />
                    {this.state.userProfileItems.FirstName.charAt(0)}. {this.state.userProfileItems.LastName} does not own any groups...
                  </div>
                }            
              </div>
            </div>
            <div className="interest-groups p-1 w-1/2">
              <h3 className="p-2 text-base text-black font-semibold">
                member groups
              </h3>
              <div className="bg-gray-900">
                {
                  this.state.memberGroups.length > 0 &&
                  <ul className="groups-list p-1 overflow-y-scroll h-32">
                  {renderMemberGroups}
                </ul>
                }
                {
                  this.state.memberGroups.length === 0 &&
                  <div className="p-3 text-gray-300">
                    <Icon className="text-center my-2 block text-4xl" iconName='Group' />
                    {this.state.userProfileItems.FirstName.charAt(0)}. {this.state.userProfileItems.LastName} is not a member of any group...
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="discover-more m-1 w-2/5 bg-gray-100 border-t-4 border-cyan-700">
          <h2 className="p-2 font-semibold text-lg text-black">
            discover more
          </h2>
          <ul className="suggestions-box p-1">
            {renderUsersToDiscover}
          </ul>
          {
            this.state.currentUser === this.state.loggedInUser &&
            <br />
          }
          {
            this.state.currentUser !== this.state.loggedInUser &&
            <ActionButton className="p-2 text-black text-sm" iconProps={backIcon} allowDisabledFocus onClick={() => this._returnToOriginalUser()}>
              return to home user
            </ActionButton>
          }
        </div>
      </div>
    );
  }

  /**
   * Gets the user profile properties of a particular user
   * @param email the user email
   * @param discover Is this for getting a current user's profile properties or for discovering new users?
   * @returns 
   */
  public _getUserProperties = (email: string, discover: boolean): IUserProfile => {
    /* Email is either 'me' (current user) or zhacXXX@live.rhul.ac.uk (another user's profile) */
    const serviceScope: ServiceScope = this.props.serviceScope;
    this.dataCenterServiceInstance = serviceScope.consume(UserProfileService.serviceKey);

    /* Get user profile properties of the current user chosen */
    console.log('Parameter passed: ', email)

    this.dataCenterServiceInstance.getUserProfileProperties(email).then((userProfileItems: IUserProfile) => {

      /* Only retrieve properties if the user actually exists */
      if (userProfileItems.UserProfileProperties !== null && userProfileItems.UserProfileProperties !== undefined) {

        for (let i: number = 0; i < userProfileItems.UserProfileProperties.length; i++) {

          if (userProfileItems.UserProfileProperties[i].Key === "msOnline-ObjectId") {
            userProfileItems.Id = userProfileItems.UserProfileProperties[i].Value;
          }

          if (userProfileItems.UserProfileProperties[i].Key === "FirstName") {
            userProfileItems.FirstName = userProfileItems.UserProfileProperties[i].Value;
          }

          if (userProfileItems.UserProfileProperties[i].Key === "LastName") {
            userProfileItems.LastName = userProfileItems.UserProfileProperties[i].Value;
          }

          if (userProfileItems.UserProfileProperties[i].Key === "UserName") {
            userProfileItems.Email = userProfileItems.UserProfileProperties[i].Value.toLowerCase();
          }

          if (userProfileItems.UserProfileProperties[i].Key === "WorkPhone") {
            userProfileItems.WorkPhone = userProfileItems.UserProfileProperties[i].Value;
          }

          if (userProfileItems.UserProfileProperties[i].Key === "Department") {
            userProfileItems.Department = userProfileItems.UserProfileProperties[i].Value;
          }

          if (userProfileItems.UserProfileProperties[i].Key === "PictureURL") {
            userProfileItems.PictureURL = userProfileItems.UserProfileProperties[i].Value;
          }
        }
        console.log('Next users profile items: ', userProfileItems)

        /* Don't display users with blank first names or last names in suggestion box */
        if (userProfileItems.FirstName.trim().length > 0 && userProfileItems.LastName.trim().length > 0) {
          /* Cases: either getting current user's properties or properties of a user to discover */
          if (!discover) {
            this.setState({ usersToDiscover: [] })
            console.log('UTD Length after SET', this.state.usersToDiscover.length)
            /* Update state to have properties of current user */

            const newProfile = new UserProfile();
            newProfile.Id = userProfileItems.Id;
            newProfile.FirstName = userProfileItems.FirstName;
            newProfile.LastName = userProfileItems.LastName;
            newProfile.Email = userProfileItems.Email;
            newProfile.Title = userProfileItems.Title;
            newProfile.WorkPhone = userProfileItems.WorkPhone;
            newProfile.DisplayName = userProfileItems.DisplayName;
            newProfile.Department = userProfileItems.Department;
            newProfile.PictureURL = userProfileItems.PictureURL;
            newProfile.UserProfileProperties = userProfileItems.UserProfileProperties;

            /* Call current user's groups */
            this._getGroups(newProfile.Email)
            /* Suggest some users to discover based on selected user's page */
            this._getUsersToDiscover(newProfile.Email)

            this.setState({ currentUser: newProfile.Email, userProfileItems: newProfile })

            /* Ignore the discovered user if it is the logged in user themself */
          } else if (userProfileItems.Email !== this.state.loggedInUser) {
            /* Update state to have the properties of a user to discover */
            const currentUsersToDiscover = this.state.usersToDiscover
            console.log('Discovering the length, ', currentUsersToDiscover.length)
            if (currentUsersToDiscover.length < 3) {
              currentUsersToDiscover.push(userProfileItems)
              this.setState({ usersToDiscover: currentUsersToDiscover })
            }
          }
          this.forceUpdate()
        }
      }
    }).catch((e) => console.log(e));
    return
  }

  /**
   * Get the groups of the user
   * @param user the user email
   */
  public _getGroups = (user: string): void => {
    console.log('Getting groups with user: ', user)
    UserGroupService.getGroups().then(groups => {
      console.log('Get groups: ', groups);

      UserGroupService.getMyOwnerGroups(groups, user).then(groups => {
        console.log('Get owner groups: ', groups);
        this.setState({
          ownerGroups: groups,
        });
      }).catch((e: any) => console.log(e));

      UserGroupService.getMyMemberGroups(groups, user).then(groups => {
        console.log('Get member groups: ', groups);
        this.setState({
          memberGroups: groups,
        });
      }).catch((e: any) => console.log(e));
    }).catch((e: any) => console.log(e));
  }

  /**
   * Algorithm to suggest (3 max.) other users profiles to check out based on the current user
   * @param email 
   */
  public _getUsersToDiscover = (email: string): void => {
    /* Initialise array */
    this.setState({ usersToDiscover: [] })

    if (email === 'me') {
      email = this.state.loggedInUser
    }
    /* Extract ZHAC code */
    const zhacCodeString = email.replace('i:0#.f|membership|', '')
    const matches = zhacCodeString.match('[0-9]+').toString()
    const zhacNumber = parseInt(matches)

    /* Random shuffle of potential user profile codes */
    let userCodeRange = [-1, -2, -3, -4, -5, 1, 2, 3, 4, 5]
    function shuffleArray(array: any) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array
    }

    /* Padding zeros to three - e.g. 5 to 005 */
    function pad(n: number, length: number) {
      let len = length - ('' + n).length;
      return (len > 0 ? new Array(++len).join('0') : '') + n
    }

    /* Shuffle the range of profiles and extract the number to use as email parameter
    i.e. Current user zhac020@live.rhul.ac.uk -> Random user code {20 + 2} -> 021
    -> Find user properties of user 'zhac022@live.rhul.ac.uk' */

    userCodeRange = shuffleArray(userCodeRange)
    const zhacCodeRanges = userCodeRange.map(c => pad((c + zhacNumber), 3))

    /* Variables for iterator */
    let i = 0

    /* Some ZHAC-XXX codes might be out of range or invalid so check through the range at least */
    console.log('This state UTD: ', this.state.usersToDiscover)
    while (this.state.usersToDiscover.length < 3 && i < zhacCodeRanges.length) {
      /* Three users to discover finally found */
      console.log(zhacCodeRanges[i], `i:0#.f|membership|zhac${zhacCodeRanges[i]}@live.rhul.ac.uk`)
      this._getUserProperties(`i:0#.f|membership|zhac${zhacCodeRanges[i]}@live.rhul.ac.uk`, true)
      /* Increment */
      i++;
    }
  }

  /**
   * Clicks profile of new user
   * @param profile the items of the new user's profile
   */
  public _clickNewProfile = (profile: IUserProfile) => {
    /* Set state to new clicked profile of another user */
    this.setState({ currentUser: profile.Email, userProfileItems: profile })
    console.log('Profile clicked: ', profile)
    /* Call user properties when state has changed */
    this._getUserProperties(`i:0#.f|membership|${profile.Email}`, false)
    this.forceUpdate()
  }

  /**
   * Returns back to the original user's profile (the current user)
   */
  public _returnToOriginalUser = () => {
    /* Set state to new clicked profile of another user */
    this.setState({ currentUser: this.state.loggedInUser })
    console.log('Return to user: ', this.state.loggedInUser)
    /* Call user properties when state has changed */
    this._getUserProperties('me', false)
    this.forceUpdate()

  }
}


