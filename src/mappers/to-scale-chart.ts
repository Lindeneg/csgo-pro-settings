import { SCALING } from '@/constants';
import toDistinctChartDataConfig from '@/mappers/to-distinct-data-config';
import type { ChartWithTitleProps } from '@/components/chart-with-title';
import scalingEnumToString from '@/mappers/scaling-enum-to-string';

const toScaleChart = (scales: number[]): ChartWithTitleProps => {
    return {
        title: 'Scaling Distribution',
        description: `Data from ${scales.length} players`,
        width: '600px',
        divider: false,
        props: {
            type: 'doughnut',
            canvasId: 'resolution-scale',
            wrapperClass: 'w-full',
            withPercentage: true,
            displayLegend: true,
            data: toDistinctChartDataConfig(
                [
                    scalingEnumToString(SCALING.NATIVE),
                    scalingEnumToString(SCALING.BLACK_BARS),
                    scalingEnumToString(SCALING.STRETCHED),
                ],
                scales,
                {
                    label: 'Resolution Scale',
                    compareLabelArray: [SCALING.NATIVE, SCALING.BLACK_BARS, SCALING.STRETCHED],
                }
            ),
        },
    };
};

export default toScaleChart;
