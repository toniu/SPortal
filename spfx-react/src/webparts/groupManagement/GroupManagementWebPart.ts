/* eslint-disable @typescript-eslint/no-floating-promises */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'GroupManagementWebPartStrings';
import GroupManagement from './components/GroupManagement/GroupManagement';
import { IGroupManagementProps } from './components/GroupManagement/IGroupManagementProps';
/* Services */
import UserGroupService from '../../services/UserGroupService';
import '../../../assets/dist/tailwind.css';

/**
 * The props of the group management web part
 */
export interface IGroupManagementWebPartProps {
  flowUrl: string;
}

/**
 * The web part for group management
 */
export default class GroupManagementWebPart extends BaseClientSideWebPart<IGroupManagementWebPartProps> {

  /**
   * The render
   */
  public render(): void {
    const element: React.ReactElement<IGroupManagementProps> = React.createElement(
      GroupManagement,
      {
        flowUrl: this.properties.flowUrl,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  /**
   * Intial set-up of required services: the user group service
   * @returns 
   */
  protected onInit(): Promise<void> {
    return super.onInit().then(() => {
      UserGroupService.setup(this.context, this.context.serviceScope);
    }).catch((e) => console.log(e));
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get disableReactivePropertyChanges(): boolean {   
    return true;   
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  /**
   * The property pane configuration
   * @returns the pages
   */
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('flowUrl', {
                  label: strings.FlowUrlLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}