import { RATE_LIMIT_MS, BATCH_SIZE } from './constants';
import type { DataResult } from './data';

type Callback<T> = (arg: T) => Promise<void>;

const respect = <T>(
    batches: number,
    callback: Callback<T>,
    data: T,
    resolve: (value: void | PromiseLike<void>) => void,
    batchNumber = 0
) => {
    const isInitial = batchNumber === 0;
    const mul = isInitial ? batches : batches * batchNumber;
    const diff = isInitial ? RATE_LIMIT_MS : RATE_LIMIT_MS - mul;

    if (mul >= RATE_LIMIT_MS || diff <= 0) {
        console.log('calling batch callback');
        callback(data).then(() => resolve());
        return;
    }

    console.log('waiting', Math.round(diff / 1000), 'seconds before proceeding due to rate limits...');

    setTimeout(() => {
        respect(batches, callback, data, resolve, batchNumber + 1);
    }, batches);
};

const respectRateLimit = <T>({ data, fromCache }: DataResult<T>, callback: Callback<T>): Promise<void> => {
    return new Promise((resolve) => {
        if (fromCache) {
            callback(data).then(() => resolve());
        } else {
            respect(BATCH_SIZE, callback, data, resolve);
        }
    });
};

export default respectRateLimit;
