/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebPartContext } from '@microsoft/sp-webpart-base';

/**
 * View group props
 */
export interface IViewGroupProps {
    returnToMainPage: () => void;
    selectedGroup: any;
    context: WebPartContext;
}