import toDistinctChartDataConfig from '@/mappers/to-distinct-data-config';
import type { ChartWithTitleProps } from '@/components/chart-with-title';
import type { ResolutionScaleData } from '@/data';
import scalingEnumToString from '@/mappers/scaling-enum-to-string';
import { SCALING } from '@/constants';

const toResolutionChart = (data: ResolutionScaleData[]): ChartWithTitleProps => {
    const uniqueResolutions: string[] = [];
    const mappedData: string[] = [];

    for (const { resolution, scaling } of data) {
        if (!resolution || scaling === null || scaling === SCALING.UNKNOWN) continue;

        const label = `${resolution} (${scalingEnumToString(scaling)})`;

        mappedData.push(label);

        if (!uniqueResolutions.includes(label)) {
            uniqueResolutions.push(label);
        }
    }

    return {
        title: 'Resolution Distribution',
        description: `Data from ${mappedData.length} players - with scaling`,
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
            data: toDistinctChartDataConfig(uniqueResolutions, mappedData),
        },
    };
};

export default toResolutionChart;
