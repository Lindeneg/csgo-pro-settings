import { join as joinPath } from 'path';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { ROOT_CACHE_PATH } from './constants';
import { normalizeString } from './utils';

export const getCachedPath = (scope: string, name: string, extension = '.html') =>
    joinPath(ROOT_CACHE_PATH, scope, `${name}${extension}`);

const actionCacheFilePath = getCachedPath('state', 'state', '.json');
const invalidSettingsCacheFilePath = getCachedPath('state', 'invalid', '.json');

const fileCacheFactory = async (path: string, onRead: (arr: string[]) => string[] | boolean, fallback?: unknown) => {
    try {
        let cache: string[] = [];

        if (!existsSync(path)) {
            await writeFile(path, JSON.stringify(cache), { encoding: 'utf-8' });
        } else {
            const rawCache = await readFile(path, { encoding: 'utf-8' });
            cache = JSON.parse(rawCache) as string[];
        }

        const callbackResult = onRead(cache);

        if (Array.isArray(callbackResult)) {
            return writeFile(path, JSON.stringify(callbackResult), { encoding: 'utf-8' });
        }
        return callbackResult;
    } catch (err) {
        console.log(err);
        return fallback;
    }
};

const containsName = (name: string, arr: string[]) => arr.includes(normalizeString(name)) || arr.includes(name);

const addIfNotFound = (name: string, arr: string[]) => {
    if (containsName(name, arr)) return false;
    arr.push(normalizeString(name));
    return arr;
};

export const getCachedDataOrNull = async (scope: string, name: string, onRetry = false): Promise<string | null> => {
    try {
        const file = await readFile(getCachedPath(scope, name), { encoding: 'utf-8' });
        return file;
    } catch (err) {
        if (onRetry) return null;
        return getCachedDataOrNull(scope, normalizeString(name), true);
    }
};

export const writeCachedData = async (scope: string, name: string, data: string) => {
    return writeFile(getCachedPath(scope, name), data, { encoding: 'utf-8' });
};

export const hasTriedToFetch = async (name: string) => {
    return fileCacheFactory(actionCacheFilePath, containsName.bind(null, name), false);
};
export const addToTriedToFetch = async (name: string) => {
    return fileCacheFactory(actionCacheFilePath, addIfNotFound.bind(null, name), false);
};

export const hasInvalidSettings = async (name: string) => {
    return fileCacheFactory(invalidSettingsCacheFilePath, containsName.bind(null, name), false);
};
export const addToHasInvalidSettings = async (name: string) => {
    return fileCacheFactory(invalidSettingsCacheFilePath, addIfNotFound.bind(null, name), false);
};
