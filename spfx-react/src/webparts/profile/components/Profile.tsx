/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';
import { IProfileProps } from './IProfileProps';
/* Components */
import { IProfileState } from './IProfileState'
import { IUserProfile } from '../components/IUserProfile'
/* Services */
import { IDataService } from '../../../services/IDataService';
import UserGroupService from '../../../services/UserGroupService';
import { UserProfileService } from '../../../services/UserProfileService';
import { ServiceScope } from '@microsoft/sp-core-library'
/* Icons */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { faUserGroup } from "@fortawesome/free-solid-svg-icons"
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons"


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

/* ... Function plans (temp) */
/* getProfileInfo(ID): to get name, and other information etc. */
/* getAllStudents(ID): get IDs and randomly select some to present to "discover more" */

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

  public render(): React.ReactElement<IProfileProps> {
    console.log('Rendering using state:', this.state)
    const renderOwnerGroups = this.state.ownerGroups.map((group: any) => <li key={group.id} className="m-1 p-1 flex bg-white">
      <FontAwesomeIcon icon={faUserGroup} className="p-1 text-black text-base" />
      <span className="mx-2 text-base"> {group.displayName} </span>
    </li>)

    const renderMemberGroups = this.state.memberGroups.map((group: any) => <li key={group.id} className="m-1 p-1 flex bg-white">
      <FontAwesomeIcon icon={faPeopleGroup} className="p-1 text-black text-base" />
      <span className="mx-2 text-base"> {group.displayName} </span>
    </li>)

    const renderUsersToDiscover = this.state.usersToDiscover.map((user: any) => <li key={user.Id} className="p-1 m-1 bg-white flex">
      <div className="w-1/4 text-3xl">
        <FontAwesomeIcon icon={faUser} className="p-3 m-2 text-white bg-gray-900 rounded-full" />
      </div>
      <div className="suggestion-name-details p-1 w-3/4">
        <h3 className="text-black font-semibold text-sm"> {user.FirstName} {user.LastName} </h3>
        <h4 className="py-1 text-black font-light text-xs"> {user.Department} </h4>
        <button type="button" onClick={() => this._clickNewProfile(user)} className="flex p-1 mx-1 bg-gray-800 text-white rounded-xl text-xs hover:bg-gray-600 transition 0.2s">
          <FontAwesomeIcon icon={faUser} className="p-1 mr-2 ml-1 text-gray-800 bg-white rounded-full" />
          <span className="mr-1"> view profile </span>
        </button>
      </div>
    </li>)

    return (
      <div className="container p-1 flex">
        <div className="profile-box m-1 bg-gray-300 border-t-4 border-indigo-600 w-3/5">
          <div className="topbar flex p-3 bg-gray-800 bg-opacity-75">
            <FontAwesomeIcon icon={faUser} className="p-3 bg-gray-700 text-3xl rounded-full text-white border-white border-4" />
            <div className="profile-icon flex">

              <h1 className="name p-3 text-2xl text-white">
                {this.state.userProfileItems.FirstName} {this.state.userProfileItems.LastName}
              </h1>
            </div>
          </div>
          <button type="button" className="editProfile p-3 float-right text-black text-2xl hover:text-gray-700 transition 0.2s" >
            <FontAwesomeIcon icon={faPencilAlt} className="mx-1" />
          </button>
          <div className="roles p-2">
            <h2 className="p-1 font-light text-xl">
              {this.state.userProfileItems.Title}
            </h2>
            <h3 className="p-1 font-semibold text-base">
              {this.state.userProfileItems.Department}
            </h3>
          </div>
          <div className="groups-box p-1 flex">
            <div className="groups p-1 w-1/2">
              <h3 className="p-2 text-base text-black font-semibold">
                Owner groups
              </h3>
              <div className="bg-gray-800">
                <ul className="groups-list p-1 overflow-y-scroll h-32">
                  {renderOwnerGroups}
                </ul>
              </div>
            </div>
            <div className="interest-groups p-1 w-1/2">
              <h3 className="p-2 text-base text-black font-semibold">
                Member groups
              </h3>
              <div className="bg-gray-800">
                <ul className="groups-list p-1 overflow-y-scroll h-32">
                  {renderMemberGroups}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="discover-more m-1 w-2/5 bg-gray-300 border-t-4 border-indigo-600">
          <h2 className="p-2 font-bold text-lg text-black">
            Discover more
          </h2>
          <ul className="suggestions-box p-1">
            {renderUsersToDiscover}
          </ul>
          <button type="button" className="p-3 text-black font-light hover:font-bold transition 0.1s">
            See more...
          </button>
        </div>
      </div>
    );
  }

  public _getUserProperties = (email: string, discover: boolean): IUserProfile => {
    /* Email is either 'me' (current user) or zhacXXX@live.rhul.ac.uk (another user's profile) */
    const serviceScope: ServiceScope = this.props.serviceScope;
    this.dataCenterServiceInstance = serviceScope.consume(UserProfileService.serviceKey);

    /* Get user profile properties of the current user chosen */
    console.log('Parameter passed: ', email)

    this.dataCenterServiceInstance.getUserProfileProperties(email).then((userProfileItems: IUserProfile) => {

      /* Only retrieve properties if the user actually exists */
      if (userProfileItems.UserProfileProperties !== null && userProfileItems.UserProfileProperties !== undefined) {
        console.log('Check dis out: does it align?', email, userProfileItems)
        const profileChosen = this.defaultProfile

        for (let i: number = 0; i < userProfileItems.UserProfileProperties.length; i++) {

          if (userProfileItems.UserProfileProperties[i].Key === "msOnline-ObjectId") {
            profileChosen.Id = userProfileItems.UserProfileProperties[i].Value;
          }

          if (userProfileItems.UserProfileProperties[i].Key === "FirstName") {
            profileChosen.FirstName = userProfileItems.UserProfileProperties[i].Value;
          }

          if (userProfileItems.UserProfileProperties[i].Key === "LastName") {
            profileChosen.LastName = userProfileItems.UserProfileProperties[i].Value;
          }

          if (userProfileItems.UserProfileProperties[i].Key === "UserName") {
            profileChosen.Email = userProfileItems.UserProfileProperties[i].Value.toLowerCase();
          }

          if (userProfileItems.UserProfileProperties[i].Key === "WorkPhone") {
            profileChosen.WorkPhone = userProfileItems.UserProfileProperties[i].Value;
          }

          if (userProfileItems.UserProfileProperties[i].Key === "Department") {
            profileChosen.Department = userProfileItems.UserProfileProperties[i].Value;
          }

          if (userProfileItems.UserProfileProperties[i].Key === "PictureURL") {
            profileChosen.PictureURL = userProfileItems.UserProfileProperties[i].Value;
          }
        }
        console.log('Next users profile items: ', profileChosen)

        /* Cases: either getting current user's properties or properties of a user to discover */
        if (!discover && ((profileChosen.Email === this.state.loggedInUser) || (profileChosen.Email === this.state.currentUser))) {
          /* Update state to have properties of current user */
          this.setState({userProfileItems: profileChosen})
        } else {
          /* Update state to have the properties of a user to discover */

          const currentUsersToDiscover = this.state.usersToDiscover
          if (currentUsersToDiscover.length < 3) {
            currentUsersToDiscover.push(profileChosen)
            this.setState({usersToDiscover: currentUsersToDiscover})
          }
        }
      }
    }).catch((e) => console.log(e));
    return
  }

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

  public _getUsersToDiscover = async (email: string): Promise<void> => {
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

    /* List of user profiles to suggest to visit */
    this.setState({usersToDiscover: []})

    /* Variables for iterator */
    let i = 0

    /* Some ZHAC-XXX codes might be out of range or invalid so check through the range at least */
    while (this.state.usersToDiscover.length < 3 && i < zhacCodeRanges.length) {
      /* Three users to discover finally found */
      console.log(zhacCodeRanges[i], `i:0#.f|membership|zhac${zhacCodeRanges[i]}@live.rhul.ac.uk`)
      this._getUserProperties(`i:0#.f|membership|zhac${zhacCodeRanges[i]}@live.rhul.ac.uk`, true)
      /* Increment */
      i++;
    }
  }

  /* Click profile of new user */
  public _clickNewProfile = (profile: IUserProfile) => {
    /* Set state to new clicked profile of another user */
    this.setState({ currentUser: profile.Email, userProfileItems: profile })

    console.log('Profile clicked: ', profile)
    /* Call user properties when state has changed */
    this._getUserProperties(profile.Email, false)
    /* Call current user's groups */
    this._getGroups(profile.Email)
    /* Suggest some users to discover based on selected user's page */
    this._getUsersToDiscover(profile.Email)
  }
}


