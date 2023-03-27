/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Props for the options container
 */
export interface IOptionsContainerProps {
  disabled: boolean;
  selectedKey?: () => string;
  options: string;
  label?: string;
  onChange?: (ev: any, option: any, isMultiSel: boolean) => void;
}