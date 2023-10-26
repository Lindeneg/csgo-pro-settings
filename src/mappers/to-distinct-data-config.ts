import type { ChartData, ChartDataset } from 'chart.js';
import { COLORS } from '@/constants';

type DatasetWithoutColor = Omit<ChartDataset, 'backgroundColor'>;
type ToDistinctOptions = Omit<DatasetWithoutColor, 'data'> & {
    compareLabelArray?: unknown[];
};

const dataSetFactory = ({ data, ...opts }: DatasetWithoutColor) =>
    ({
        ...opts,
        data,
        backgroundColor: COLORS.slice(0, data.length),
    }) as ChartDataset;

const countDistinctValues = <TData>(labels: unknown[], data: TData[]) => {
    const counter = labels.map(() => 0);

    for (const value of data) {
        const index = labels.indexOf(value);
        counter[index]++;
    }

    return counter;
};

const sortLabelsDesc = <TLabels, TData>(labels: TLabels[], data: TData[]) => {
    const mappedLabels = labels.map((d, i) => {
        return {
            label: d,
            data: data[i] || 0,
        };
    });

    const sortedLabels = mappedLabels.sort((a, b) => {
        return b.data > a.data ? 1 : -1;
    });

    return sortedLabels.reduce(
        (arr, cur) => {
            arr[0].push(cur.label);
            arr[1].push(cur.data as TData);
            return arr;
        },
        [[], []] as [labels: TLabels[], data: TData[]]
    );
};

const toDistinctChartDataConfig = <TLabels, TData>(
    labels: TLabels[],
    data: TData[],
    { compareLabelArray, ...opts }: ToDistinctOptions = {}
): ChartData => {
    const countedData = countDistinctValues(compareLabelArray ?? labels, data);

    const [sortedLabels, sortedData] = sortLabelsDesc(labels, countedData);

    return {
        labels: sortedLabels,
        datasets: [dataSetFactory({ data: sortedData, ...opts })],
    };
};

export default toDistinctChartDataConfig;
