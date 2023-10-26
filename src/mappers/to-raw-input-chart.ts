import toDistinctChartDataConfig from '@/mappers/to-distinct-data-config';
import type { ChartWithTitleProps } from '@/components/chart-with-title';

const toRawInputChart = (rawInput: boolean[]): ChartWithTitleProps => {
    const rawInputInts = rawInput.map((value) => (value ? 1 : 0));

    return {
        title: 'Raw Input Distribution',
        description: `Data from ${rawInputInts.length} players`,
        width: '600px',
        divider: false,
        props: {
            type: 'doughnut',
            canvasId: 'raw-input-scale',
            wrapperClass: 'w-full',
            withPercentage: true,
            displayLegend: true,
            data: toDistinctChartDataConfig(['Off', 'On'], rawInputInts, {
                label: 'Raw Input',
                compareLabelArray: [0, 1],
            }),
        },
    };
};

export default toRawInputChart;
