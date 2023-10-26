import { parse, type HTMLElement } from 'node-html-parser';
import type { Player } from '@prisma/client';
import api, { type PlayerOptions } from './prisma';
import { DataResult, getHtmlIfPathHasNotBeenProcessed } from './data';
import { addToHasInvalidSettings } from './cache';
import { getPropsFromTables, getScalingFromString, normalizeString, parseTable } from './utils';
import { PLAYER_TABLE_COLUMN_MAPPING, PLAYER_CREATED_IDENTIFIER, PLAYER_BASE_URL, SCALING } from './constants';

const transformValue = (key: keyof Player, value: string) => {
    switch (key) {
        case 'refreshRate':
        case 'pollingRate':
        case 'eDpi':
        case 'dpi':
            return value ? Number.parseInt(value.replace('Hz', '').trim()) : null;
        case 'rawInput':
            return value === 'On';
        case 'scaling':
            return getScalingFromString(value);
        case 'dataSubmittedAt':
            return value ? new Date(value) : null;
        case 'sensitivity':
        case 'zoomSensitivity':
            return value ? Number.parseFloat(value.replace(' ', '.')) : null;
        default:
            return value;
    }
};

const playerSettingsFactory = (): PlayerOptions => ({
    resolution: null,
    scaling: null,
    foundFromTeam: null,
    refreshRate: null,
    monitor: null,
    dataSubmittedAt: null,
    href: null,
    mouse: null,
    eDpi: null,
    dpi: null,
    pollingRate: null,
    sensitivity: null,
    zoomSensitivity: null,
    rawInput: null,
    playerSubmitted: null,
});

const createPlayerSettingsFromRawData = async (name: string, data: Record<string, string>): Promise<PlayerOptions> => {
    const playerSettings = playerSettingsFactory();

    Object.entries(data).forEach(([key, value]) => {
        const column = PLAYER_TABLE_COLUMN_MAPPING.find(([column]) => column === key);

        if (!column) return;

        const [_, playerSettingsKey] = column;

        if (!value) {
            console.log('missing value for', playerSettingsKey, 'for player', name);
            return;
        }

        playerSettings[playerSettingsKey] = transformValue(playerSettingsKey, value) as never;
    });

    return playerSettings;
};

const invalidPlayerSettings = ({ dataSubmittedAt, href, ...rest }: PlayerOptions): boolean => {
    const values = Object.values(rest);
    const nullValues = values.filter((value) => value === null);
    return values.length === nullValues.length;
};

const createPlayerUrl = (name: string) => `${PLAYER_BASE_URL}/${name}`;

const postprocessPlayer = (
    html: HTMLElement,
    name: string,
    teamName: string | null,
    rawPlayerSettings: PlayerOptions
) => {
    rawPlayerSettings.playerSubmitted = !!html.querySelector(
        'small abbr[title="has submitted their own settings to Liquipedia"]'
    );

    rawPlayerSettings.foundFromTeam = teamName;

    rawPlayerSettings.href = createPlayerUrl(name);

    if (
        rawPlayerSettings.scaling !== SCALING.NATIVE &&
        rawPlayerSettings.resolution &&
        /1980.1080/.test(rawPlayerSettings.resolution)
    ) {
        rawPlayerSettings.scaling = SCALING.NATIVE;
    }
};

export const getPlayerSettingsFromName = async (
    name: string,
    teamName: string | null = null
): Promise<DataResult<null>> => {
    const { data, fromCache } = await getHtmlIfPathHasNotBeenProcessed('players', name);

    if (!data || data === PLAYER_CREATED_IDENTIFIER) return { data: null, fromCache };

    const html = parse(data);
    const parseTableFn = parseTable.bind(null, /Mouse Settings/);
    const tableProps = getPropsFromTables(html, parseTableFn);
    const rawPlayerSettings = await createPlayerSettingsFromRawData(name, tableProps);

    if (invalidPlayerSettings(rawPlayerSettings)) {
        console.log('invalid player settings for', name);
        await addToHasInvalidSettings(name);
        return { data: null, fromCache };
    }

    postprocessPlayer(html, name, teamName, rawPlayerSettings);

    await api.createPlayerSettings(normalizeString(name), rawPlayerSettings);

    return { data: null, fromCache };
};
