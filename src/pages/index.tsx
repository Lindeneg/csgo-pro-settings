import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import toScaleChart from '@/mappers/to-scale-chart';
import toResolutionChart from '@/mappers/to-resolution-chart';
import ChartWithTitle, { ChartWithTitleProps } from '@/components/chart-with-title';
import data from '@/data';
import toDpiSensitivityChart from '@/mappers/to-dpi-sensitivity-chart';
import toRawInputChart from '@/mappers/to-raw-input-chart';
import toResolutionScaleChart from '@/mappers/to-resolution-scale-chart';
import Introduction from '@/components/introduction';

interface StupidlyCachedData {
    playerCount: number;
    charts: (ChartWithTitleProps | ChartWithTitleProps[])[];
}

const CACHE_KEY = 'what-are-you-even-doing';
const stupidlySimpleInMemoryCache = new Map<typeof CACHE_KEY, StupidlyCachedData | null>([[CACHE_KEY, null]]);

export const getServerSideProps = (async () => {
    const cached = stupidlySimpleInMemoryCache.get(CACHE_KEY);

    if (cached !== null && cached?.playerCount && cached.charts.length) return { props: cached };

    const { scaling, rawInput, resolution, scaleRes, sensDpi } = await data.getPlayersData();
    const playerCount = await data.getPlayerCount();

    const scaleChart = toScaleChart(scaling);
    const resChart = toResolutionChart(resolution);
    const resScaleChart = toResolutionScaleChart(scaleRes);
    const dpiSensChart = toDpiSensitivityChart(sensDpi);
    const rawInputChart = toRawInputChart(rawInput);

    const charts = [dpiSensChart, resScaleChart, resChart, [scaleChart, rawInputChart]];

    stupidlySimpleInMemoryCache.set(CACHE_KEY, { playerCount, charts });

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
