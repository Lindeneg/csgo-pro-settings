import { exit } from 'process';
import { join as joinPath } from 'path';
import type { PlayerOptions } from './prisma';

const SCRAPER_NAME = process.env.SCRAPER_NAME || null;
const SCRAPER_AUTHOR = process.env.SCRAPER_AUTHOR || null;

if (!SCRAPER_NAME || !SCRAPER_AUTHOR) {
    console.log('SCRAPER_NAME and SCRAPER_AUTHOR must be set in .env');
    exit(1);
}

console.log('using scraper name', SCRAPER_NAME, 'and author', SCRAPER_AUTHOR);

export const PLAYER_CREATED_IDENTIFIER = 'player-created';

// https://liquipedia.net/api-terms-of-use
export const BASE_URL = 'https://liquipedia.net/counterstrike/api.php';

export const PLAYER_BASE_URL = 'https://liquipedia.net/counterstrike';

// custom user agent must be supplied
const CUSTOM_UA_HEADER = `${SCRAPER_NAME} (${SCRAPER_AUTHOR})`;

// since 'action=parse' is used, at least 30sec between each request
export const RATE_LIMIT_MS = 30010;

export const BATCH_SIZE = RATE_LIMIT_MS / 5;

export const HEADERS = {
    'User-Agent': CUSTOM_UA_HEADER,
    Accept: 'application/json',
    'Accept-Encoding': 'gzip',
};

export const ROOT_CACHE_PATH = joinPath(__dirname, '..', '..', 'scraper-cache');

export const CACHE_FOLDERS = [
    joinPath(ROOT_CACHE_PATH, 'players'),
    joinPath(ROOT_CACHE_PATH, 'portal'),
    joinPath(ROOT_CACHE_PATH, 'teams'),
    joinPath(ROOT_CACHE_PATH, 'state'),
];

export const UPDATED_AT_REGEX = /updated-as-of-(\d{4}-\d{2}-\d{2})/;

export const PLAYER_TABLE_COLUMN_MAPPING: [string, keyof PlayerOptions][] = [
    ['mouse', 'mouse'],
    ['monitor', 'monitor'],
    ['scaling', 'scaling'],
    ['refresh-rate', 'refreshRate'],
    ['in-game-resolution', 'resolution'],
    ['updatedAt', 'dataSubmittedAt'],
    ['effective-dpi', 'eDpi'],
    ['dots-per-inch', 'dpi'],
    ['times-per-second-that-sensor-is-polled', 'pollingRate'],
    ['in-game-sensitivity-setting', 'sensitivity'],
    ['in-game-zoom-sensitivity-setting', 'zoomSensitivity'],
    ['in-game-raw-input-setting', 'rawInput'],
];

export const SCALING = {
    NATIVE: 0,
    BLACK_BARS: 1,
    STRETCHED: 2,
    UNKNOWN: 3,
} as const;
