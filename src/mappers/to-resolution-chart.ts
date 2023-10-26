import toDistinctChartDataConfig from '@/mappers/to-distinct-data-config';
import type { ChartWithTitleProps } from '@/components/chart-with-title';

const toResolutionChart = (resolutions: string[]): ChartWithTitleProps => {
    const uniqueResolutions = Array.from(new Set(resolutions));

    return {
        title: 'Resolution Distribution',
        description: `Data from ${resolutions.length} players - without scaling`,
        width: '90%',
        divider: true,
        props: {
            type: 'bar',
            canvasId: 'resolution',
            wrapperClass: 'w-full',
            xLabel: 'Resolution',
            yLabel: 'Player Count',
            withPercentage: true,
            displayLegend: false,
            data: toDistinctChartDataConfig(uniqueResolutions, resolutions),
        },
    };
};

export default toResolutionChart;
