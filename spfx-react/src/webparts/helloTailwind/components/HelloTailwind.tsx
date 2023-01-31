import * as React from 'react';
import { IHelloTailwindProps } from './IHelloTailwindProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class HelloTailwind extends React.Component<IHelloTailwindProps, {}> {
  public render(): React.ReactElement<IHelloTailwindProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      userDisplayName
    } = this.props;

    return (
      <section className='tw-overflow-hidden tw-p-10 bg-blue-200'>
        <div className='tw-text-center text-xs'>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className='tw-w-full tw-max-w-[420px]' />
          <h2 className="text-xs">Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>
          <h3>Welcome to SharePoint Framework!</h3>
          <p>
            The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It&#39;s the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.
          </p>
          <h4>Learn more about SPFx development:</h4>
        </div>
      </section>
    );
  }
}