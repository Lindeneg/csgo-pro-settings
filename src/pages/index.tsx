import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import toScaleChart from '@/mappers/to-scale-chart';
import toResolutionChart from '@/mappers/to-resolution-chart';
import ChartWithTitle, { ChartWithTitleProps } from '@/components/chart-with-title';
import data from '@/data';
import toDpiSensitivityChart from '@/mappers/to-dpi-sensitivity-chart';
import toRawInputChart from '@/mappers/to-raw-input-chart';
import toResolutionScaleChart from '@/mappers/to-resolution-scale-chart';
import Introduction from '@/components/introduction';

export const getServerSideProps = (async () => {
    const { scaling, rawInput, resolution, scaleRes, sensDpi } = await data.getPlayersData();
    const playerCount = await data.getPlayerCount();

    const scaleChart = toScaleChart(scaling);
    const resChart = toResolutionChart(resolution);
    const resScaleChart = toResolutionScaleChart(scaleRes);
    const dpiSensChart = toDpiSensitivityChart(sensDpi);
    const rawInputChart = toRawInputChart(rawInput);

    const charts = [dpiSensChart, resScaleChart, resChart, [scaleChart, rawInputChart]];

    return { props: { charts, playerCount } };
}) satisfies GetServerSideProps<{
    charts: (ChartWithTitleProps | ChartWithTitleProps[])[];
    playerCount: number;
}>;

const MainPage = ({ charts, playerCount }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <main className="w-full flex flex-col items-center gap-6">
            <Introduction playerCount={playerCount} />
            {charts.map((chart, i) => (
                <ChartWithTitle key={i} {...chart} />
            ))}
        </main>
    );
};

export default MainPage;
