import { exit } from 'process';
import { existsSync, mkdirSync } from 'fs';
import type { HTMLElement } from 'node-html-parser';
import { CACHE_FOLDERS, UPDATED_AT_REGEX, SCALING } from './constants';

export const getScalingFromString = (str: string) => {
    if (!str) return SCALING.UNKNOWN;

    if (/native/i.test(str)) return SCALING.NATIVE;
    if (/stretched/i.test(str)) return SCALING.STRETCHED;
    if (/black bars?/i.test(str)) return SCALING.BLACK_BARS;

    return SCALING.UNKNOWN;
};

export const createCacheFoldersIfNotExists = async () => {
    for (const folder of CACHE_FOLDERS) {
        if (existsSync(folder)) continue;
        try {
            console.log('creating cache folder', folder);
            mkdirSync(folder, { recursive: true });
        } catch (err) {
            console.log('failed to create cache folder', err);
            exit(1);
        }
    }
};

export const normalizeString = (str: string) => {
    let normalized = str;

    try {
        normalized = decodeURIComponent(str);
    } catch (err) {
        console.log('failed to decodeURIComponent', str);
    }

    return normalized.replaceAll(/[\n;:.?*^',\-&/\\()!@#%]/g, ' ').trim();
};

export const normalizeStringWithDashes = (str: string) => normalizeString(str).replaceAll(' ', '-').toLowerCase();

export const getPropsFromTables = (root: HTMLElement, parser: (table: HTMLElement) => Record<string, string>) => {
    const tables = root.querySelectorAll('table.wikitable');

    return tables.reduce(
        (acc, cur) => {
            const parsed = parser(cur);

            acc = { ...acc, ...parsed };

            return acc;
        },
        {} as Record<string, string>
    );
};

export const parseTable = (ignoreColumnsRegex: RegExp | null, table: HTMLElement) => {
    const rows = table
        .querySelectorAll('tr td')
        .map((e) => e.text)
        .filter((e) => e !== '\n');
    let columns = table.querySelectorAll('tr th');

    if (ignoreColumnsRegex) {
        columns = columns.filter((e) => !ignoreColumnsRegex.test(e.text));
    }

    return columns.reduce(
        (acc, cur, i) => {
            const text = normalizeStringWithDashes(
                (cur?.text === '\n' ? cur?.querySelector('abbr')?.getAttribute('title') : cur.text) ?? ''
            );

            const value = rows[i];

            if (!value) {
                const updatedAtMatch = UPDATED_AT_REGEX.exec(text);

                if (updatedAtMatch?.[1]) {
                    acc['updatedAt'] = updatedAtMatch[1];
                    return acc;
                }
                return acc;
            }

            acc[text] = normalizeString(value);

            return acc;
        },
        {} as Record<string, string>
    );
};
