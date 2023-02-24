/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-var */
import * as React from 'react';
// import styles from './Groups.module.scss';
import { IGroupsProps } from './IGroupsProps';

// Create state
export interface IGroupsState {
 showmessageBar:boolean; //to show/hide message bar on success
 message:string; // what message to be displayed in message bar
 itemID:number; // current item ID after create new item is clicked
}

export default class Groups extends React.Component<IGroupsProps, IGroupsState> {


  public render(): React.ReactElement<IGroupsProps> {
    return (
      <div className="m-5 p-3 bg-black-100">
          Template
      </div>
    );
  }

}