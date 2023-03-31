import * as React from 'react';
import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { IPollAnalyticsInfo } from '../../models';
import { Icon } from 'office-ui-fabric-react';

/**
 * Props for quick poll chart
 */
export interface IQuickPollChartProps {
  PollAnalytics: IPollAnalyticsInfo;
}

/**
 * Component for quick poll chart
 */
export default class QuickPollChart extends React.Component<IQuickPollChartProps, {}> {
  private charttype: ChartType = null;
  public render(): React.ReactElement<IQuickPollChartProps> {
    return (
      <div>
        <div className="ms-Grid" dir="ltr">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg12 ms-md12 ms-sm12">
              <div className="p-2 my-1 bg-gray-900 text-base text-white flex">
                <Icon className="mx-3 block text-base font-bold" iconName='PollResults' />
                {this.props.PollAnalytics ? this.props.PollAnalytics.Question : ''}
              </div>
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-lg12 ms-md12 ms-sm12">
              {this.renderChart()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Renders chart based on chart type and poll analytics
   * @returns the JSX element
   */
  private renderChart(): JSX.Element {
    const { PollAnalytics } = this.props;
    if (undefined !== this.props.PollAnalytics) {
      this.getChartType();
      return (
        this.charttype === ChartType.Line ? (
          <ChartControl
            loadingtemplate={() => <div>Please wait...</div>}
            type={this.charttype}
            data={{
              labels: PollAnalytics.Labels,
              datasets: [{
                label: 'Results',
                data: PollAnalytics.PollResponse,
                fill: false,
                borderColor: "rgb(77, 139, 240)"
              }]
            }} />
        ) : (
          <ChartControl
            loadingtemplate={() => <div>Please wait...</div>}
            type={this.charttype}
            data={{
              labels: PollAnalytics.Labels,
              datasets: [{
                label: 'Results',
                data: PollAnalytics.PollResponse,
              }]
            }} />
        )
      );
    }
  }

  /**
   * Gets the selected chart type
   */
  private getChartType = (): void => {
    switch (this.props.PollAnalytics.ChartType.toLocaleLowerCase()) {
      case 'pie':
        this.charttype = ChartType.Pie;
        break;
      case 'doughnut':
        this.charttype = ChartType.Doughnut;
        break;
      case 'bar':
        this.charttype = ChartType.Bar;
        break;
      case 'horizontalbar':
        this.charttype = ChartType.HorizontalBar;
        break;
      case 'line':
        this.charttype = ChartType.Line;
        break;
      default:
        this.charttype = ChartType.Doughnut;
        break;
    }
  }
}