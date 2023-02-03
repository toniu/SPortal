/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-void */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'FeedWebpartStrings';
import Feed from './components/FeedWebpart';
import { IFeedWebpartProps } from './components/IFeedWebpartProps';
import { IPropertyFieldSite, PropertyFieldSitePicker } from '@pnp/spfx-property-controls/lib/PropertyFieldSitePicker';

export interface IFeedWebpartWebPartProps {
  description: string;
  StyleToggle: string;
  AuthorToggle: string;
  sites: IPropertyFieldSite[];
  Site: any[];
}

export default class FeedWebpart extends BaseClientSideWebPart <IFeedWebpartProps> {
  public render(): void {
    const element: React.ReactElement<IFeedWebpartProps> = React.createElement(
      Feed,
      {
        description: this.properties.description,
        StyleToggle: this.properties.StyleToggle,
        sites: this.properties.sites,
        context: this.context,
        AuthorToggle: this.properties.AuthorToggle,
        Site: this.properties.Site,
        onChangeProperty: this.onChangeProperty
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  public  async onInit(): Promise<void> {
    return Promise.resolve();
  }
/*
  protected async onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: unknown,
    newValue: unknown
  ):Promise<void> {
   
    if (propertyPath === "sites") {

       const value:IPropertyFieldSite[] = newValue as IPropertyFieldSite[];
       if (value  && !value.length) {
        this.context.propertyPane.refresh();
        
        this.render()
        return;
      } else {
        this.context.propertyPane.refresh();
      
      }
    }
  }*/
  protected async onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: unknown,
    newValue: unknown
  ):Promise<void> {
    if (propertyPath === "sites") {
       const value: IPropertyFieldSite[] = newValue as IPropertyFieldSite[];
       if (value  && !value.length) {
         this.properties.Site = [];
        this.context.propertyPane.refresh();
        return;
      } else {
        this.properties.Site = newValue as any;
        this.context.propertyPane.refresh();
        return;
      }
    }
  }
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  public async getSelectedListFields() {
    if (this.properties.Site) {
      this.context.propertyPane.refresh();
    }
  }

  public onChangeProperty = (changeType: string, oldValue: any, newValue: any[]): void => {
        void this.getSelectedListFields();
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
              groupFields: [
                PropertyPaneToggle('StyleToggle', {
                  onText: 'Stack',
                  offText: 'Single',
                  label: 'Style'
                }),
                PropertyPaneToggle('AuthorToggle', {
                  onText: 'Hidden',
                  offText: 'Shown',
                  label: 'Author'
                }),
                PropertyFieldSitePicker('sites', {
                  label: 'Select sites',
                  initialSites: this.properties.sites,
                  context: this.context as any,
                  deferredValidationTime: 200,
                  multiSelect: true,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  key: 'sitesFieldId'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
