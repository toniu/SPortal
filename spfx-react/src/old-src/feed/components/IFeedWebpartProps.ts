/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";

export interface IFeedWebpartProps {
  description: string;
  StyleToggle: string;
  AuthorToggle: string;
  sites: IPropertyFieldSite[];
  context: WebPartContext;
  Site: any[];
  onChangeProperty: any;
}
