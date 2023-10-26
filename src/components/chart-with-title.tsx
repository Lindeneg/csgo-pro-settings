import Chart, { type ChartProps } from '@/components/chart';
import type { ReactNode } from 'react';

export interface ChartWithTitleProps {
    title: string;
    description?: string;
    width: string;
    divider: boolean;
    props: ChartProps;
}

const ChartSection = ({ divider, children }: { divider: boolean; children: ReactNode }) => {
    return (
        <>
            <section className="w-full flex flex-col items-center gap-6">
                {children}
                {divider && <hr className="w-full" />}
            </section>
        </>
    );
};

const ChartWithTitleCore = ({ title, width, divider, props, description }: ChartWithTitleProps) => {
    return (
        <>
            <div style={{ width }} className="inline-flex flex-col text-center items-center">
                <h1 className="m-4">{title}</h1>
                {description && <small className="italic">{description}</small>}
                <Chart {...props} />
            </div>
            {divider && <hr className="w-full" />}
        </>
    );
};

const ChartWithTitle = (props: ChartWithTitleProps | ChartWithTitleProps[]) => {
    if ('title' in props) {
        return (
            <ChartSection divider={false}>
                <ChartWithTitleCore {...props} />
            </ChartSection>
        );
    }

    const propArr = Object.values(props);
    const hasDivider = propArr.some((chart) => chart.divider);

    return (
        <ChartSection divider={hasDivider}>
            <div className="w-full flex flex-row justify-center gap-6">
                {propArr.map((chart, i) => (
                    <ChartWithTitleCore key={chart.title + i} {...chart} divider={false} />
                ))}
            </div>
        </ChartSection>
    );
};

export default ChartWithTitle;
