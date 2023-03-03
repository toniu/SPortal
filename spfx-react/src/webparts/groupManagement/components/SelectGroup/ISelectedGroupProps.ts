import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ISelectedGroupProps {
    returnToMainPage: () => void;
    context: WebPartContext;
}