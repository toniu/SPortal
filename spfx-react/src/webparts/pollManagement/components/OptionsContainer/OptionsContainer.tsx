/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { IOptionsContainerProps } from './IOptionsContainerProps';
// import * as _ from 'lodash';

export interface IOptionsContainerState {
    selChoices?: string[];
}

export default class OptionsContainer extends React.Component<IOptionsContainerProps, IOptionsContainerState> {
    constructor(props: IOptionsContainerProps) {
        super(props);
        this.state = {
            selChoices: []
        };
    }

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

    private _getSelectedKey = (): string => {
        return this.props.selectedKey();
    }

    private _onChange = (ev: React.FormEvent<HTMLInputElement>, option: any): void => {
        this.props.onChange(ev, option, false);
    }

}