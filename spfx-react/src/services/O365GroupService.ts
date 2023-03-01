/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-void */
import { MSGraphClientV3, HttpClientResponse, HttpClient, IHttpClientOptions } from "@microsoft/sp-http";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IGroup, IGroupCollection } from "../webparts/groupManagement/models";
/* SP/PNP imports */
import { SPFI } from '@pnp/sp';
import { getSP } from '../pnpjsConfig';
import { IItemAddResult } from "@pnp/sp/items";
import "@pnp/sp/site-users/web"

export class O365GroupService {
  private _sp:SPFI;
  public context: WebPartContext;

  public setup(context: WebPartContext): void {
    this.context = context;
    this._sp = getSP(context);
  }

  public getGroups(): Promise<IGroup[]> {
    return new Promise<IGroup[]>((resolve) => {
      try {
        // Prepare the output array
        const o365groups: Array<IGroup> = new Array<IGroup>();

        this.context.msGraphClientFactory
          .getClient('3')
          .then((client: MSGraphClientV3) => {
            client
              .api("/groups?$filter=groupTypes/any(c:c eq 'Unified')")
              .get((error: any, groups: IGroupCollection) => {
                // Map the response to the output array
                if (groups) {
                  groups.value.map((item: any) => {
                    o365groups.push({
                      id: item.id,
                      displayName: item.displayName,
                      description: item.description,
                      visibility: item.visibility,
                      teamsConnected: item.resourceProvisioningOptions.indexOf("Team") > -1 ? true : false
                    });
                  });
                }

                resolve(o365groups);
              }).catch((e: any) => console.log(e));
          }).catch(e => console.log(e));
      } catch (error) {
        console.error(error);
      }
    });
  }

  public async getMyMemberGroups(): Promise<IGroup[]> {
    return new Promise<IGroup[]>((resolve) => {
      try {
        // Prepare the output array
        const o365groups: Array<IGroup> = new Array<IGroup>();

        void this.context.msGraphClientFactory
          .getClient('3')
          .then((client: MSGraphClientV3) => {
            void client
              .api("/me/memberOf/$/microsoft.graph.group?$filter=groupTypes/any(a:a eq 'unified')")
              .get((_error: any, groups: IGroupCollection) => {
                // Map the response to the output array
                if (groups) {
                  groups.value.map((item: any) => {
                    o365groups.push({
                      id: item.id,
                      displayName: item.displayName,
                      description: item.description,
                      visibility: item.visibility
                    });
                  });
                }

                resolve(o365groups);
              }).catch((e: any) => console.log(e));
          });
      } catch (error) {
        console.error(error);
      }
    });
  }

  public getMyOwnerGroups(): Promise<any> {
    return new Promise<any>((resolve) => {
      try {
        // Prepare the output array
        const o365groups: Array<IGroup> = new Array<IGroup>();

        this.context.msGraphClientFactory
          .getClient('3')
          .then((client: MSGraphClientV3) => {
            client
              .api("/me/ownedObjects/$/microsoft.graph.group")
              .get((error: any, groups: any, rawResponse: any) => {
                // Map the response to the output array
                if (groups) {
                  groups.value.map((item: any) => {
                    o365groups.push({
                      id: item.id,
                      displayName: item.displayName,
                      description: item.description,
                      visibility: item.visibility
                    });
                  });
                }

                resolve(o365groups);
              }).catch((e: any) => console.log(e));
          }).catch(e => console.log(e));
      } catch (error) {
        console.error(error);
      }
    });
  }

  public addMember(groupId: string): Promise<any> {
    return new Promise<void>((resolve) => {
      this.context.msGraphClientFactory
        .getClient('3')
        .then((client: MSGraphClientV3) => {
          client
            .api(`/groups/${groupId}/members/$ref`)
            .post(`{ "@odata.id": "https://graph.microsoft.com/v1.0/users/${this.context.pageContext.user.loginName}" }`)
            .then((addMemberResponse: any) => {
              if (addMemberResponse === undefined) {
                resolve();
              }
              else {
                throw new Error(`Error occured while joining the Group`);
              }
            });
        }).catch(e => console.log(e));
    });
  }

  public getUserId(): Promise<string> {
    return new Promise<string>((resolve) => {
      try {
        this.context.msGraphClientFactory
          .getClient('3')
          .then((client: MSGraphClientV3) => {
            client
              .api(`/me/id`)
              .get((error: any, userId: any) => {
                resolve(userId.value);
              });
          }).catch(e => console.log(e));
      }
      catch (error) {
        console.error(error);
      }
    });
  }

  public removeMember(groupId: string): Promise<any> {
    return new Promise<void>((resolve) => {
      this.getUserId().then(userId => {
        this.context.msGraphClientFactory
          .getClient('3')
          .then((client: MSGraphClientV3) => {
            client
              .api(`/groups/${groupId}/members/${userId}/$ref`)
              .delete((error: any, response: any, rawResponse: any) => {
                if (rawResponse.status === 204) {
                  resolve(response);
                }
                else {
                  throw new Error(`Error occured while leaving the Group`);
                }
              });
          }).catch(e => console.log(e));
      }).catch(e => console.log(e));
    });
  }

  public requestToJoinPrivateGroup(flowUrl: string, groupId: string, groupName: string, groupUrl: string): Promise<any> {

    const body: string = JSON.stringify({
      'groupId': groupId,
      'groupName': groupName,
      'groupUrl': groupUrl,
      'requestorName': this.context.pageContext.user.displayName,
      'requestorEmail': this.context.pageContext.user.email
    });

    const requestHeaders: Headers = new Headers();
    requestHeaders.append('Content-type', 'application/json');

    const httpClientOptions: IHttpClientOptions = {
      body: body,
      headers: requestHeaders
    };

    return this.context.httpClient.post(
      flowUrl,
      HttpClient.configurations.v1,
      httpClientOptions)
      .then((response: HttpClientResponse): Promise<HttpClientResponse> => {
        return response.json();
      });
  }

  public getGroupLink(groups: IGroup): Promise<any> {
    return new Promise<any>((resolve) => {
      try {
        this.context.msGraphClientFactory
          .getClient('3')
          .then((client: MSGraphClientV3) => {
            client
              .api(`/groups/${groups.id}/sites/root/weburl`)
              .get((error: any, group: any) => {
                resolve(group);
              });
          }).catch(e => console.log(e));
      } catch (error) {
        console.error(error);
      }
    });
  }

  public getGroupThumbnail(groups: IGroup): Promise<any> {
    return new Promise<any>((resolve) => {
      try {
        this.context.msGraphClientFactory
          .getClient('3')
          .then((client: MSGraphClientV3) => {
            client
              .api(`/groups/${groups.id}/photos/48x48/$value`)
              .responseType('blob')
              .get((error: any, group: any) => {
                resolve(window.URL.createObjectURL(group));
              });
          }).catch(e => console.log(e));
      } catch (error) {
        console.error(error);
      }
    });
  }

  public async createGroup(groupName: string, groupDescription: string, groupVisibility: string, groupOwners: string[], groupMembers: string[]): Promise<void> {
    console.log("REQUEST:")
    console.log('group name: ', groupName)
    console.log('group description: ', groupDescription)
    console.log('group visibility: ', groupVisibility)
    console.log('group owners: ', groupOwners)
    console.log('group members: ', groupMembers)


    return new Promise<void>((resolve) => {
      /* Temp */


      const groupRequest: any = {
        displayName: groupName,
        description: groupDescription,
        groupTypes: [
          "Unified"
        ],
        mailEnabled: true,
        mailNickname: groupName.replace(/\s/g, ""),
        securityEnabled: false,
        visibility: groupVisibility,
      };
      

      if (groupOwners && groupOwners.length) {
        groupRequest['owners@odata.bind'] = groupOwners.map(owner => {
          return `https://graph.microsoft.com/v1.0/users/${owner}`;
        });
      }

      if (groupMembers && groupMembers.length) {
        groupRequest['members@odata.bind'] = groupMembers.map(member => {
          return `https://graph.microsoft.com/v1.0/users/${member}`;
        });
      }
      console.log('Group request: ', groupRequest);
      console.log('\nGroup Request Owners Bind: ', groupRequest['owners@odata.bind']);
      console.log('\nGroup Request Members Bind: ', groupRequest['members@odata.bind']);

      this.context.msGraphClientFactory
        .getClient('3')
        .then((client: MSGraphClientV3) => {
          client
            .api("/groups")
            .post(groupRequest)
            .then((groupResponse: any) => {
              console.log(groupResponse);
              resolve();
            }).catch((e: any) => console.log(e));
        }).catch(e => console.log(e));
      
    });
  }

  /**
   * Creates a new group and adds to Sharepoint Lists, along with its owners and members
   * @param groupName 
   * @param groupDescription 
   * @param groupVisibility 
   * @param groupOwners 
   * @param groupMembers 
   */
  public createGroupToList = async (groupName: string, groupDescription: string, groupVisibility: string, groupOwners: string[], groupMembers: string[]): Promise<void> => {
    try {
      /* ID creation: generated using timestamp */
      const generatedGroupId =  'g-' + (Date.now() + Math.random()).toString()
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
}

const GroupService = new O365GroupService();
export default GroupService;