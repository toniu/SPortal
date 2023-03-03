/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-void */
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IGroup } from "../webparts/groupManagement/models";
/* SP/PNP imports */
import { SPFI } from '@pnp/sp';
import { getSP } from '../pnpjsConfig';
import { IItemAddResult } from "@pnp/sp/items";
import "@pnp/sp/site-users/web"

export class UserGroupService {
  private _sp: SPFI;
  public context: WebPartContext;
  private userEmail: string;

  public async setup(context: WebPartContext): Promise<void> {
    this.context = context;
    this._sp = getSP(context);

    /* Get email of current user */
    this.userEmail = await (await this._sp.web.currentUser()).UserPrincipalName
  }

  public getGroupLink(groups: IGroup): Promise<any> {
    return new Promise<any>((resolve) => {
      try {
        console.log(groups)
      } catch (error) {
        console.error(error);
      }
    });
  }

  public getGroups = async (): Promise<IGroup[]> => {
    /* Get items from SP list Groups */
    const groups = await this._sp.web.lists.getByTitle("Groups").items()
    return new Promise<IGroup[]>((resolve) => {
      try {
        const spGroups: Array<IGroup> = new Array<IGroup>();

        /* Push each group item into SP (Sharepoint Lists) Groups list */
        groups.map((item: any) => {
          spGroups.push({
            id: item.Title,
            displayName: item.field_1,
            description: item.field_2,
            visibility: item.field_7,
            SPId: item.ID
          });
        });

        resolve(spGroups);

      } catch (error) {
        console.error(error);
      }
    });
  }

  public getMyMemberGroups = async (groups: IGroup[]): Promise<IGroup[]> => {
    try {
      /* Get items from SP list Groups */
      const allGroupMembers = await this._sp.web.lists.getByTitle("GroupMembers").items()

      /* Filtered list of group members list where the user is a member */
      let groupMembers = allGroupMembers.filter(item => item.field_1.toLowerCase() === this.userEmail.toLowerCase())
      /* Map to only have the list of the group IDs where user is a member of */
      groupMembers = groupMembers.map(item => item.Title)

      /* Filter groups to only include groups that include the group IDs of the groups the user is a member of */
      groups = groups.filter(group => groupMembers.indexOf(group.id) >= 0)
    } catch (e) {
      console.log(e)
    }
    return groups;
  }

  public getMyOwnerGroups = async (groups: IGroup[]): Promise<IGroup[]> => {
    try {
      /* Get items from SP list Groups */
      const allGroupOwners = await this._sp.web.lists.getByTitle("GroupOwners").items()

      /* Filtered list of group owners list where the user is a owner */
      let groupOwners = allGroupOwners.filter(item => item.field_1.toLowerCase() === this.userEmail.toLowerCase())
      /* Map to only have the list of the group IDs where user is a owner of */
      groupOwners = groupOwners.map(item => item.Title)

      /* Filter groups to only include groups that include the group IDs of the groups the user is a member of */
      groups = groups.filter(group => groupOwners.indexOf(group.id) >= 0)
    } catch (e) {
      console.log(e)
    }
    return groups;
  }

  public addMembersToGroup = async (groupId: string, memberEmails: any): Promise<void> => {
    try {
      /* Set email parameter to current user, if current user is trying to join a group
      otherwise use email of selected users to add to existing group 
      
      Cases: 
      joining a group (use current user's email): 'me' -> ['zhacXXX@live.rhul.ac.uk']
      OR adding members (other users' emails) [zhac... zhac..., zhacn...] */
      if (memberEmails === 'me') {
        memberEmails = []
        memberEmails.push(this.userEmail)
      }
      /* Retrieve the Sharepoint list ID (required to delete item with) */
      const groupMembers = await this._sp.web.lists.getByTitle("GroupMembers").items();
      /* Use filter to find the items with the groupId and the member emails to add */
      groupMembers.filter(item => item.Title === groupId && memberEmails.indexOf(item.field_1) >= 0)

      /*------ SP batch post request to remove selected members of group */
      /* If item is found */
      if (groupMembers[0]) {
        const [batchedSP, execute] = this._sp.batched();
        const batchedMembers = batchedSP.web.lists.getByTitle("GroupMembers");

        let res: any[] = [];
        res = [];

        /* Add SP batch for adding group members */
        for (let i = 0; i < groupMembers.length; i++) {
          /* In context: field_1 is the member email to add */
          batchedMembers.items.add({
            Title: groupId,
            field_1: groupMembers[i].field_1,
          }).then(r => res.push(r))
            .catch(e => console.log(e));
        }

        /* Execute batch for owners and members */
        await execute();
        console.log('\nFinal response from added group members: ')
        for (let i = 0; i < res.length; i++) {
          console.log(res[i])
        }
      } else {
        console.log('Add members request failed')
      }
    } catch (e) {
      console.log(e)
    }
  }

  public removeMembersFromGroup = async (groupId: string, memberEmails: any): Promise<void> => {
    try {
      /* Set email parameter to current user, if current user is trying to leave a group
      otherwise use email of selected users to remove from an existing group 
      
      Cases: 
      leaving a group (use current user's email): 'me' -> ['zhacXXX@live.rhul.ac.uk']
      OR removing members (other users' emails) [zhac... zhac..., zhacn...] */
      if (memberEmails === 'me') {
        memberEmails = []
        memberEmails.push(this.userEmail)
      }
      /* Retrieve the Sharepoint list ID (required to delete item with) */
      const groupMembers = await this._sp.web.lists.getByTitle("GroupMembers").items();
      /* Use filter to find the items with the groupId and the member emails to delete */
      groupMembers.filter(item => item.Title === groupId && memberEmails.indexOf(item.field_1) >= 0)

      /*------ SP batch post request to remove selected members of group */
      /* If item is found */
      if (groupMembers[0]) {
        const [batchedSP, execute] = this._sp.batched();
        const batchedMembers = batchedSP.web.lists.getByTitle("GroupMembers");

        let res: any[] = [];
        res = [];

        /* Add SP batch for removing group members */
        for (let i = 0; i < groupMembers.length; i++) {
          batchedMembers.items.getById(groupMembers[i].ID).delete().then(r => res.push(r))
            .catch(e => console.log(e));
        }

        /* Execute batch for removing selected group members */
        await execute();
        console.log('\nFinal response from removed group members: ')
        for (let i = 0; i < res.length; i++) {
          console.log(res[i])
        }
      } else {
        console.log('Remove members request failed')
      }
    } catch (e) {
      console.log(e)
    }
  }



  /**
   * Creates a new group and adds to Sharepoint Lists, along with its owners and members
   * @param groupName 
   * @param groupDescription 
   * @param groupVisibility 
   * @param groupOwners 
   * @param groupMembers 
   */
  public createGroup = async (groupName: string, groupDescription: string, groupVisibility: string, groupOwners: string[], groupMembers: string[]): Promise<void> => {
    try {
      /* ID creation: generated using timestamp */
      const generatedGroupId = 'g-' + (Date.now() + Math.random()).toString()
      /* 
      GROUP REQUEST COLUMNS:
        Title: the generated group ID
        field_1: Group name
        field_2: Group description
        field_3: Group type
        field_4: Mail enabled?
        field_5: Mail nickname
        field_6: Security enabled?
        field_7: Group visibility
      };
      */
      const groupRequest: any = {
        Title: generatedGroupId,
        field_1: groupName,
        field_2: groupDescription,
        field_3: "Unified",
        field_4: true,
        field_5: groupName.replace(/\s/g, ""),
        field_6: false,
        field_7: groupVisibility,
      };

      console.log('Creating new group of request ', groupRequest)

      /* SP post request to create new group */
      const iar: IItemAddResult = await this._sp.web.lists.getByTitle("Groups").items.add(groupRequest);
      console.log('Group created...\n', iar)

      /*------ SP post request to add owners of the new group */
      const [batchedSP, execute] = this._sp.batched();
      const ownersList = batchedSP.web.lists.getByTitle("GroupOwners");
      const membersList = batchedSP.web.lists.getByTitle("GroupMembers");
      let res: any[] = [];
      res = [];

      /* Add SP batch for adding group owners */
      for (let i = 0; i < groupOwners.length; i++) {
        /* 
        GROUP OWNER REQUEST COLUMNS:
        Title: the generated group ID
        field_1: the email of group owner
        */
        ownersList.items.add({
          Title: generatedGroupId,
          field_1: groupOwners[i]
        }).then(r => res.push(r))
          .catch(e => console.log(e));
      }

      /* Add SP batch for adding group members */
      for (let i = 0; i < groupMembers.length; i++) {
        /* 
        GROUP MEMBER REQUEST COLUMNS:
        Title: the generated group ID
        field_1: the email of group member
        */
        membersList.items.add({
          Title: generatedGroupId,
          field_1: groupMembers[i]
        }).then(r => res.push(r))
          .catch(e => console.log(e));
      }

      /* Execute batch for owners and members */
      await execute();
      console.log('\nFinal response from created group: ')
      for (let i = 0; i < res.length; i++) {
        console.log(res[i])
      }
    } catch (e) {
      console.log(e);
    }
  }

  public editGroupDetails = async (spGroupID: number, groupId: string, groupName: string, groupDescription: string, groupVisibility: string, membersToAdd: string[], membersToRemove: string[]): Promise<void> => {
    try {
      /* In context to internal fields,
      field_1: the group name 
      field_2: the group description
      field_7: the group visibility */
      const updateRequest: any = {
        field_1: groupName,
        field_2: groupDescription,
        field_7: groupVisibility,
      };

      /* Update group details */
      const groups = this._sp.web.lists.getByTitle("Groups");
      const i = await groups.items.getById(spGroupID).update({updateRequest});
      console.log(i)

      /* Batch update for adding or removing members from group */
      if (membersToAdd.length > 0) {
        await this.addMembersToGroup(groupId, membersToAdd)
      }
      if (membersToRemove.length > 0) {
        await this.removeMembersFromGroup(groupId, membersToRemove)
      }

    } catch (e) {
      console.log(e)
    }
  }

  public deleteGroup = async (groupId: string): Promise<void> => {
    try {
      /* Retrieve the Sharepoint list ID (required to delete item with) */
      const groupToDelete = await this._sp.web.lists.getByTitle("Groups").items.filter(`Title eq '${groupId}'`)()
      console.log('GTD', groupToDelete)

      /* If item is found */
      if (groupToDelete[0]) {
        /* Delete using the Sharepoint list item ID (note: this is different to the groupId) */
        await this._sp.web.lists.getByTitle("Groups").items.getById(groupToDelete[0].ID).delete();
        console.log(`Group ID ${groupId} deleted...\n`)
      } else {
        console.log('Delete request failed - no group to delete')
      }

      /* SP List for group members and owners to delete */
      const [batchedSP, execute] = this._sp.batched();
      const ownersList = batchedSP.web.lists.getByTitle("GroupOwners");
      const membersList = batchedSP.web.lists.getByTitle("GroupMembers");

      const groupOwners = await ownersList.items.filter(`Title eq '${groupId}'`)()
      const groupMembers = await membersList.items.filter(`Title eq '${groupId}'`)()

      let res: any[] = [];
      res = [];

      /* Add SP batch for deleting group owners of deleted group ID */
      for (let i = 0; i < groupOwners.length; i++) {
        ownersList.items.getById(groupOwners[i].ID).delete().then(r => res.push(r))
          .catch(e => console.log(e));
      }

      /* Add SP batch for deleting group members of deleted group ID */
      for (let i = 0; i < groupMembers.length; i++) {
        membersList.items.getById(groupMembers[i].ID).delete().then(r => res.push(r))
          .catch(e => console.log(e));
      }

      /* Execute batch for deleted owners and members */
      await execute();
      console.log('\nFinal response from deleted group: ')
      for (let i = 0; i < res.length; i++) {
        console.log(res[i])
      }
    } catch (e) {
      console.log(e)
    }
  }
}

const GroupService = new UserGroupService();
export default GroupService;