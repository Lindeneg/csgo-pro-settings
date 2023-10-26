import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Chart, DoughnutController, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(DoughnutController, ArcElement, ChartDataLabels);

const App = ({ Component, pageProps }: AppProps) => {
    return <Component {...pageProps} />;
};

export default App;
