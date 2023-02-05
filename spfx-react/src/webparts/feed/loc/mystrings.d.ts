declare interface IFeedWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  StyleToggle: string;
  AuthorToggle: string;
  sites: IPropertyFieldSite[];
}

declare module 'FeedWebPartStrings' {
  const strings: IFeedWebPartStrings;
  export = strings;
}
