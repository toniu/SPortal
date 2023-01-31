/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IOptionsContainerProps {
  disabled: boolean;
  selectedKey?: () => string;
  options: string;
  label?: string;
  multiSelect: boolean;
  onChange?: (ev: any, option: any, isMultiSel: boolean) => void;
}