import { addToTriedToFetch, getCachedDataOrNull, hasInvalidSettings, hasTriedToFetch, writeCachedData } from './cache';
import { normalizeStringWithDashes } from './utils';
import api from './prisma';
import { PLAYER_CREATED_IDENTIFIER, BASE_URL, HEADERS } from './constants';

export interface DataResult<T = string | null> {
    data: T;
    fromCache: boolean;
}

const buildUrl = (name: string) => {
    return `${BASE_URL}?action=parse&page=${name}&format=json&prop=text`;
};

const getData = async (path: string): Promise<string | null> => {
    const res = await fetch(buildUrl(path), {
        method: 'GET',
        headers: HEADERS,
    });

    if (res.ok) {
        const json = await res.json();
        const result = json?.parse?.text?.['*'] || null;

        if (!result) {
            await addToTriedToFetch(path);
            return null;
        }

        return result;
    }

    await addToTriedToFetch(path);

    return null;
};

export const getHtmlIfPathHasNotBeenProcessed = async (scope: string, path: string): Promise<DataResult> => {
    const name = normalizeStringWithDashes(path);

    if (scope === 'players') {
        if (await api.hasCreatedPlayer(path)) {
            console.log('skipping', name, 'already created');
            return { data: PLAYER_CREATED_IDENTIFIER, fromCache: true };
        } else if (await hasInvalidSettings(path)) {
            console.log('skipping', name, 'has invalid settings');
            return { data: null, fromCache: true };
        }
    }

    const cachedData = await getCachedDataOrNull(scope, name);

    if (cachedData) {
        console.log('using cached html for', name);
        return { data: cachedData, fromCache: true };
    }

    if (await hasTriedToFetch(path)) {
        console.log('skipping', name, 'already tried to fetch');
        return { data: null, fromCache: true };
    }

    const data = await getData(path);

    if (!data) {
        console.log('failed to fetch html for', name);
        return { data: null, fromCache: false };
    }

    console.log('fetched html for', name);

    await writeCachedData(scope, name, data);

    return { data, fromCache: false };
};
