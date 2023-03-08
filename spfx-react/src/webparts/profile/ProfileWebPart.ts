import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'ProfileWebPartStrings';
import Profile from './components/Profile';
import { IProfileProps } from './components/IProfileProps';
/* Services */
import UserGroupService from '../../services/UserGroupService';
import '../../../assets/dist/tailwind.css';

export interface IProfileWebPartProps {
  description: string;
}

export default class ProfileWebPart extends BaseClientSideWebPart<IProfileWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IProfileProps> = React.createElement(
      Profile,
      {
        description: this.properties.description,
        userDisplayName: this.context.pageContext.user.displayName,
        userName: encodeURIComponent('i:0#.f|membership|' + this.context.pageContext.user.loginName),
        serviceScope: this.context.serviceScope,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return super.onInit().then(async () => {
      await UserGroupService.setup(this.context, this.context.serviceScope);
    }).catch((e) => console.log(e));
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
