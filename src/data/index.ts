import prisma from '../../lib/prisma';

export interface SensDpiData {
    sensitivity: number;
    dpi: number;
}

export interface ResolutionScaleData {
    resolution: string;
    scaling: number;
}

const keys = ['resolution', 'scaling', 'rawInput', 'sensitivity', 'dpi'] as const;
const select = keys.reduce(
    (acc, cur) => {
        acc[cur] = true;
        return acc;
    },
    {} as Record<(typeof keys)[number], true>
);

const getPlayersData = async () => {
    const data = await prisma.player.findMany({
        select,
    });

    return data.reduce(
        (acc, cur) => {
            if (cur === null) return acc;

            keys.forEach((key) => {
                const val = cur[key];

                if (val === null) return;

                acc[key].push(val as never);
            });

            return acc;
        },
        {
            scaling: [] as number[],
            resolution: [] as string[],
            rawInput: [] as boolean[],
            sensitivity: [] as number[],
            dpi: [] as number[],
            scaleRes: data.map((p) => ({ resolution: p.resolution, scaling: p.scaling })) as ResolutionScaleData[],
            sensDpi: data.map((p) => ({ dpi: p.dpi, sensitivity: p.sensitivity })) as SensDpiData[],
        }
    );
};

const getPlayerCount = async () => {
    return prisma.player.count();
};

const data = { getPlayersData, getPlayerCount };

export default data;
