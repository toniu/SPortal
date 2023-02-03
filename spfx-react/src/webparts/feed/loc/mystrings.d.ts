declare interface IReactNewsWebpartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  StyleToggle: string;
  AuthorToggle: string;
  sites: IPropertyFieldSite[];
}

declare module 'FeedWebpartStrings' {
  const strings: IFeedWebpartStrings;
  export = strings;
}
