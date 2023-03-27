/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartType } from "@pnp/spfx-controls-react/lib/ChartControl";

/**
 * The model for information about poll analytics
 */
export interface IPollAnalyticsInfo {
  Question: string;
  Labels: string[];
  PollResponse: any[];
  ChartType: ChartType;
}