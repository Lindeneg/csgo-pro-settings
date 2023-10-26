import { useEffect, useRef } from 'react';
import { Chart as ChartJs, type ChartConfiguration, type ChartType } from 'chart.js/auto';
import { BUBBLE_RADIUS_RATIO } from '@/constants';
import type { Context } from 'chartjs-plugin-datalabels';
import type { BubbleDataEntry } from '@/mappers/to-dpi-sensitivity-chart';

export interface ChartProps extends ChartConfiguration {
    canvasId?: string;
    xLabel?: string;
    yLabel?: string;
    wrapperClass?: string;
    displayLegend?: boolean;
    withPercentage?: boolean;
}

const setLabel = (
    axis: 'x' | 'y',
    label: string,
    opts: ChartConfiguration['options'] = {}
): ChartConfiguration['options'] => {
    opts.scales = {
        ...opts.scales,
        [axis]: {
            title: {
                display: true,
                text: label,
            },
        },
    };

    return opts;
};

const setBubbleFooterCallback = (opts: ChartConfiguration['options'] = {}): ChartConfiguration['options'] => {
    opts.plugins = {
        ...opts.plugins,
        tooltip: {
            callbacks: {
                footer: ([tooltipItem]: any) => {
                    const count = tooltipItem.dataset.data.reduce((acc: number, cur: BubbleDataEntry) => {
                        acc += cur.meta;
                        return acc;
                    }, 0);
                    const r = Math.round((tooltipItem.raw.r * count) / BUBBLE_RADIUS_RATIO);
                    return `Sensitivity: ${tooltipItem.raw.x}\nDPI: ${tooltipItem.raw.y}\nCount: ${(
                        (r / count) *
                        100
                    ).toFixed(2)}%`;
                },
            },
        },
    };

    return opts;
};

const createOptions = (
    type: ChartType,
    {
        xLabel,
        yLabel,
        displayLegend,
        withPercentage,
    }: Pick<ChartProps, 'xLabel' | 'yLabel' | 'displayLegend' | 'withPercentage'>,
    opts: ChartConfiguration['options'] = {}
): ChartConfiguration['options'] => {
    opts.events = ['mousemove'];

    if (type === 'bubble') setBubbleFooterCallback(opts);

    opts.plugins = {
        ...opts.plugins,
        legend: {
            display: typeof displayLegend === 'boolean' ? displayLegend : true,
        },
        datalabels: withPercentage
            ? {
                  formatter: (value: unknown, ctx: Context) => {
                      if (!ctx.chart.data.datasets.length) return;

                      let sum = 0;

                      ctx.chart.data.datasets[0].data.forEach((data) => {
                          sum += Number(data);
                      });

                      return ((Number(value) * 100) / sum).toFixed(2) + '%';
                  },
                  color: '#ffffff',
              }
            : (null as any),
    };

    if (xLabel) setLabel('x', xLabel, opts);
    if (yLabel) setLabel('y', yLabel, opts);

    return opts;
};

const Chart = ({ wrapperClass, canvasId, withPercentage, xLabel, yLabel, displayLegend, ...opts }: ChartProps) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const chartId = useRef<string | null>(null);

    const wrapperClassName = wrapperClass ?? 'w-96';

    useEffect(() => {
        if (chartId.current !== null) return;

        if (ref.current) {
            const config = {
                ...opts,
                options: createOptions(opts.type, { xLabel, yLabel, displayLegend, withPercentage }, opts.options),
            };

            const chart = new ChartJs(ref.current, config);

            chartId.current = chart.id;
        }
    }, [xLabel, yLabel, displayLegend, withPercentage, opts]);

    return (
        <div className={wrapperClassName}>
            <canvas id={canvasId} ref={ref}></canvas>
        </div>
    );
};

export default Chart;
