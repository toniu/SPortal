/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-var */
import * as React from 'react';
// import styles from './Groups.module.scss';
import { IGroupsProps } from './IGroupsProps';
import { getSP } from '../../../pnpjsConfig';

// Import library
import {  PrimaryButton, Stack} from 'office-ui-fabric-react';
import { SPFI, IItemAddResult } from "@pnp/sp/presets/all";

// Create state
export interface IGroupsState {
 showmessageBar:boolean; //to show/hide message bar on success
 message:string; // what message to be displayed in message bar
 itemID:number; // current item ID after create new item is clicked
}

export default class Groups extends React.Component<IGroupsProps, IGroupsState> {
  private sp:SPFI;

  // Constructor to intialize state and pnp sp object.
  constructor(props: IGroupsProps,state:IGroupsState) {
    super(props);
    this.state = {showmessageBar:false,message:"",itemID:0};
    this.sp = getSP(this.props.spcontext)
  }


  public render(): React.ReactElement<IGroupsProps> {
    return (
      <div className="m-5 p-3 bg-black-100">

        <Stack horizontal tokens={{childrenGap:40}}>
          <PrimaryButton text="Create New Item" onClick={()=>this.createNewItem()}  />
          <PrimaryButton text="Get Item" onClick={()=>this.getItem()} />
          <PrimaryButton text="Update Item" onClick={()=>this.updateItem()} />
          <PrimaryButton text="Delete Item" onClick={()=>this.deleteItem()} />
        </Stack>
      </div>
    );
  }

  // method to use pnp objects and create new item
  private async createNewItem(){
    const iar: IItemAddResult = await this.sp.web.lists.getByTitle("DemoList").items.add({
      Title: "Title " + new Date(),
      Description: "This is item created using PnP JS"
    });
    console.log(iar);
    this.setState({showmessageBar:true,message:"Item Added Sucessfully",itemID:iar.data.Id});
  }

  // method to use pnp objects and get item by id, using item ID set from createNewItem method.
  private async getItem(){
    // get a specific item by id
    const item: any = await this.sp.web.lists.getByTitle("DemoList").items.getById(this.state.itemID);
    console.log(item);
    this.setState({showmessageBar:true,message:"Last Item Created Title:--> " + item.Title});
  }

  // method to use pnp object udpate item by id, using item id set from createNewItem method.
  private async updateItem(){

    const list = this.sp.web.lists.getByTitle("DemoList");
    const i = await list.items.getById(this.state.itemID).update({
      Title: "My Updated Title",
      Description: "Here is a updated description"
    });
    console.log(i);
    this.setState({showmessageBar:true,message:"Item updated sucessfully"});
  }

  // method to use pnp object udpate item by id, using item id set from createNewItem method.
  private async deleteItem(){
    const list = this.sp.web.lists.getByTitle("DemoList");
    var res = await list.items.getById(this.state.itemID).delete();
    console.log(res);
    this.setState({showmessageBar:true,message:"Item deleted sucessfully"});
  }
}