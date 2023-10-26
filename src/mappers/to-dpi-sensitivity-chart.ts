import type { ChartWithTitleProps } from '@/components/chart-with-title';
import type { SensDpiData } from '@/data';
import { BUBBLE_DPI_LIMIT, BUBBLE_RADIUS_RATIO, BUBBLE_SENSITIVITY_LIMIT } from '@/constants';

export interface BubbleDataEntry {
    x: number;
    y: number;
    r: number;
    meta?: any;
}

const getBubbleRadius = (r: number, count: number) => {
    if (r === 0) return 0;

    const result = (r / count) * BUBBLE_RADIUS_RATIO;

    if (result < 2) return 2;

    return result;
};

const toDpiSensitivityChart = (
    mouseData: SensDpiData[],
    sensLimit = BUBBLE_SENSITIVITY_LIMIT,
    dpiLimit = BUBBLE_DPI_LIMIT
): ChartWithTitleProps => {
    const data: BubbleDataEntry[] = [{ x: 0, y: 0, r: 0 }];
    let count = 0;

    for (const mouse of mouseData) {
        if (mouse.sensitivity > sensLimit || mouse.dpi > dpiLimit) continue;

        const existingMouse = data.find((m) => m.x === mouse.sensitivity && m.y === mouse.dpi);

        if (existingMouse) {
            existingMouse.r += 1;
            count++;
            continue;
        }

        data.push({
            x: mouse.sensitivity,
            y: mouse.dpi,
            r: 1,
        });
        count++;
    }

    return {
        title: 'DPI vs Sensitivity',
        description: `Data from ${count} players. Sensitivity > ${BUBBLE_SENSITIVITY_LIMIT} and DPI > ${BUBBLE_DPI_LIMIT} are omitted.`,
        width: '90%',
        divider: true,
        props: {
            type: 'bubble',
            canvasId: 'dpi-vs-sensitivity',
            wrapperClass: 'w-full',
            xLabel: 'Sensitivity',
            yLabel: 'Dots Per Inch',
            withPercentage: false,
            displayLegend: false,
            data: {
                datasets: [
                    {
                        data: data.map((d) => ({ x: d.x, y: d.y, r: getBubbleRadius(d.r, count), meta: d.r })),
                        backgroundColor: 'rgba(187,4,4,0.84)',
                    },
                ],
            },
        },
    };
};

export default toDpiSensitivityChart;
