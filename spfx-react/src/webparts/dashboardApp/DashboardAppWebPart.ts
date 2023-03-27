/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption,
  PropertyPaneLabel

} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DashboardAppWebPartStrings';
import DashboardApp from './components/DashboardApp';
import { IDashboardAppProps,  } from './components/IDashboardAppProps';
import { PropertyFieldDateTimePicker, DateConvention, IDateTimeFieldValue } from '@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker';

import '../../../assets/dist/tailwind.css';

/**
 * The props of the Dashboard web part
 */
export interface IDashboardAppWebPartProps {
  title: string;
  siteUrl: string;
  list: string;
  eventStartDate: IDateTimeFieldValue;
  eventEndDate: IDateTimeFieldValue;
  errorMessage: string;
}

import UserEventService from '../../services/UserEventService';
import '../../../assets/dist/tailwind.css';
import * as moment from 'moment';

/**
 * The dashboard web part
 */
export default class DashboardAppWebPart extends BaseClientSideWebPart<IDashboardAppWebPartProps> {

  private lists: IPropertyPaneDropdownOption[] = [];
  private listsDropdownDisabled: boolean = true;
  private errorMessage: string;

  /**
   * The render (including the props to pass on)
   */
  public render(): void {
    const element: React.ReactElement<IDashboardAppProps> = React.createElement(
      DashboardApp,
      {
        title: this.properties.title,
        siteUrl: this.properties.siteUrl,
        list: this.properties.list,
        displayMode: this.displayMode,
        updateProperty: (value: string) => {
          this.properties.title = value;
        },
        context: this.context,
        eventStartDate: this.properties.eventStartDate,
        eventEndDate: this.properties.eventEndDate,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  /**
   * The initial steps to do on set-up
   * @returns set-up the event service required
   */
  protected async onInit(): Promise<any> {
    this.properties.siteUrl = this.properties.siteUrl ? this.properties.siteUrl : this.context.pageContext.site.absoluteUrl;
    if (!this.properties.eventStartDate) {
      this.properties.eventStartDate = { value: moment().subtract(2, 'years').startOf('month').toDate(), displayValue: moment().format('ddd MMM MM YYYY') };
    }
    if (!this.properties.eventEndDate) {
      this.properties.eventEndDate = { value: moment().add(20, 'years').endOf('month').toDate(), displayValue: moment().format('ddd MMM MM YYYY') };
    }
    if (this.properties.siteUrl && !this.properties.list) {
      const _lists = await this.loadLists();
      if (_lists.length > 0) {
        this.lists = _lists;
        this.properties.list = this.lists[0].key.toString();
      }
    }

    return super.onInit().then(() => {
      UserEventService.setup(this.context);
    }).catch((e) => console.log(e));
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  /**
   * Property pane configuration
   */
  protected async onPropertyPaneConfigurationStart(): Promise<void> {

    try {
      if (this.properties.siteUrl) {
        const _lists = await this.loadLists();
        this.lists = _lists;
        this.listsDropdownDisabled = false;
        //  await this.loadFields(this.properties.siteUrl);
        this.context.propertyPane.refresh();

      } else {
        this.lists = [];
        this.properties.list = '';
        this.listsDropdownDisabled = false;
        this.context.propertyPane.refresh();
      }

    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Loads the lists on property pane dropdown
   * @returns the lists
   */
  private async loadLists(): Promise<IPropertyPaneDropdownOption[]> {
    const _lists: IPropertyPaneDropdownOption[] = [];
    try {
      const results = await UserEventService.getSiteLists(this.properties.siteUrl);
      for (const list of results) {
        _lists.push({ key: list.Id, text: list.Title });
      }
      // push new item value
    } catch (error) {
      this.errorMessage = `${error.message} -  please check if site url if valid.`;
      this.context.propertyPane.refresh();
    }
    return _lists;
  }

  /**
   * Display of start date validation message
   * @param date the date
   * @returns the validation message
   */
  private onEventStartDateValidation(date: string): string {
    if (date && this.properties.eventEndDate.value) {
      if (moment(date).isAfter(moment(this.properties.eventEndDate.value))) {
        return strings.SartDateValidationMessage;
      }
    }
    return '';
  }

    /**
   * Display of end date validation message
   * @param date the date
   * @returns the validation message
   */
  private onEventEndDateValidation(date: string): string {
    if (date && this.properties.eventEndDate.value) {
      if (moment(date).isBefore(moment(this.properties.eventStartDate.value))) {
        return strings.EnDateValidationMessage;
      }
    }
    return '';
  }

  /**
   * Gets the error message for a site URL not existing
   * @param value the value
   * @returns 
   */
  private async onSiteUrlGetErrorMessage(value: string): Promise<any> {
    let returnValue: string = '';
    if (value) {
      returnValue = '';
    } else {
      const previousList: string = this.properties.list;
      const previousSiteUrl: string = this.properties.siteUrl;
      // reset selected item
      this.properties.list = undefined;
      this.properties.siteUrl = undefined;
      this.lists = [];
      this.listsDropdownDisabled = true;
      await this.onPropertyPaneFieldChanged('list', previousList, this.properties.list);
      await this.onPropertyPaneFieldChanged('siteUrl', previousSiteUrl, this.properties.siteUrl);
      this.context.propertyPane.refresh();
    }
    return returnValue;
  }

  /**
   * Event fired for change in property pane field
   * @param propertyPath the string
   * @param oldValue the old value
   * @param newValue the new value
   */
  protected async onPropertyPaneFieldChanged(propertyPath: string, oldValue: string, newValue: string): Promise<void> {
    try {
      // reset any error
      this.properties.errorMessage = undefined;
      this.errorMessage = undefined;
      this.context.propertyPane.refresh();

      if (propertyPath === 'siteUrl' && newValue) {
        super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
        const _oldValue = this.properties.list;
        await this.onPropertyPaneFieldChanged('list', _oldValue, this.properties.list);
        this.context.propertyPane.refresh();
        const _lists = await this.loadLists();
        this.lists = _lists;
        this.listsDropdownDisabled = false;
        this.properties.list = this.lists.length > 0 ? this.lists[0].key.toString() : undefined;
        this.context.propertyPane.refresh();
        this.render();
      }
      else {
        super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
      }
    } catch (error) {
      this.errorMessage = `${error.message} -  please check if site url if valid.`;
      this.context.propertyPane.refresh();
    }
  }

  /**
   * Gets the property pane configuration
   * @returns The pages of configuration panel
   */
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    // EndDate and Start Date defualt values

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
                PropertyPaneTextField('siteUrl', {
                  label: strings.SiteUrlFieldLabel,
                  onGetErrorMessage: this.onSiteUrlGetErrorMessage.bind(this),
                  value: this.context.pageContext.site.absoluteUrl,
                  deferredValidationTime: 1200,
                }),
                PropertyPaneDropdown('list', {
                  label: strings.ListFieldLabel,
                  options: this.lists,
                  disabled: this.listsDropdownDisabled,
                }),
                PropertyPaneLabel('eventStartDate', {
                  text: strings.eventSelectDatesLabel
                }),
                PropertyFieldDateTimePicker('eventStartDate', {
                  label: 'From',
                  initialDate: this.properties.eventStartDate,
                  dateConvention: DateConvention.Date,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  onGetErrorMessage: this.onEventStartDateValidation,
                  deferredValidationTime: 0,
                  key: 'eventStartDateId'
                }),
                PropertyFieldDateTimePicker('eventEndDate', {
                  label: 'to',
                  initialDate: this.properties.eventEndDate,
                  dateConvention: DateConvention.Date,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  onGetErrorMessage: this.onEventEndDateValidation,
                  deferredValidationTime: 0,
                  key: 'eventEndDateId'
                }),
                PropertyPaneLabel('errorMessage', {
                  text: this.errorMessage,
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
