import { WebPartContext } from '@microsoft/sp-webpart-base';

/**
 * The new group props
 */
export interface INewGroupProps {
    returnToMainPage: () => void;
    context: WebPartContext;
}