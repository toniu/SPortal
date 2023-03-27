/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { IOptionsContainerProps } from './IOptionsContainerProps';
// import * as _ from 'lodash';

/**
 * The state for the options container
 */
export interface IOptionsContainerState {
    selChoices?: string[];
}

/**
 * The component for the options container
 */
export default class OptionsContainer extends React.Component<IOptionsContainerProps, IOptionsContainerState> {
    /**
     * Initial set-up and initial state based on props
     * @param props the props
     */
    constructor(props: IOptionsContainerProps) {
        super(props);
        this.state = {
            selChoices: []
        };
    }

    /**
     * The render
     * @returns the JSX element
     */
    public render(): JSX.Element {
        const { disabled } = this.props;
        return (
            <div>
                <ChoiceGroup disabled={disabled}
                    selectedKey={this._getSelectedKey()}
                    options={this.onRenderChoiceOptions()} required={true} label=""
                    onChange={this._onChange}
                />
            </div>
        );
    }

    /**
     * Gets the options based on string; array created by split commas
     * @returns the choices
     */
    private getOptions = (): string[] => {
        const tempChoices: string[] = [];
        if (this.props.options.indexOf(',') >= 0) {
            const tmpChoices = this.props.options.split(',');
            tmpChoices.map(choice => {
                if (choice && choice.trim().length > 0) tempChoices.push(choice);
            });
        } else tempChoices.push(this.props.options);
        return tempChoices;
    }

    /**
     * Render of the choice options
     * @returns the choice group options
     */
    private onRenderChoiceOptions(): IChoiceGroupOption[] {
        const choices: IChoiceGroupOption[] = [];
        const tempChoices: string[] = this.getOptions();
        if (tempChoices.length > 0) {
            tempChoices.map((choice: string) => {
                choices.push({
                    key: choice.trim(),
                    text: choice.trim()
                });
            });
        } else {
            choices.push({
                key: '0',
                text: "Sorry, no choices found",
                disabled: true,
            });
        }
        return choices;
    }

    /**
     * Gets the currently selected key
     * @returns the selected key
     */
    private _getSelectedKey = (): string => {
        return this.props.selectedKey();
    }

    /**
     * Event fired for change of option input
     * @param ev the event
     * @param option the option chosen
     */
    private _onChange = (ev: React.FormEvent<HTMLInputElement>, option: any): void => {
        this.props.onChange(ev, option, false);
    }

}