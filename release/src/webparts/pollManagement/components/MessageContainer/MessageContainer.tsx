import * as React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { Text } from 'office-ui-fabric-react/lib/Text';
import styles from './MessageContainer.module.scss';
import { MessageScope } from '../../../../common/enumHelper';

/**
 * Props for the message container
 */
export interface IMessageContainerProps {
    Message?: string;
    MessageScope: MessageScope;
}

/**
 * The component for the message container; can be success, failure, warning or info
 * @param props the props 
 * @returns the JSX element
 */
export default function MessageContainer(props: IMessageContainerProps): JSX.Element {
    return (
        <div className={styles.MessageContainer}>
            {
                props.MessageScope === MessageScope.Success &&
                <MessageBar messageBarType={MessageBarType.success}>
                    <Text block variant={"mediumPlus"}>{props.Message}</Text>
                </MessageBar>
            }
            {
                props.MessageScope === MessageScope.Failure &&
                <MessageBar messageBarType={MessageBarType.error}>
                    <Text block variant={"mediumPlus"}>{props.Message}</Text>
                </MessageBar>
            }
            {
                props.MessageScope === MessageScope.Warning &&
                <MessageBar messageBarType={MessageBarType.warning}>
                    <Text block variant={"mediumPlus"}>{props.Message}</Text>
                </MessageBar>
            }
            {
                props.MessageScope === MessageScope.Info &&
                <MessageBar className={styles.infoMessage}>
                    <Text block variant={"mediumPlus"}>{props.Message}</Text>
                </MessageBar>
            }
        </div>
    );
}