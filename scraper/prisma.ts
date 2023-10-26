import type { Player } from '@prisma/client';
import prisma from '../lib/prisma';
import { normalizeString } from './utils';

export type PlayerOptions = Partial<Omit<Player, 'id' | 'name' | 'createdAt'>>;

const createPlayerSettings = async (name: string, opts: PlayerOptions = {}): Promise<void> => {
    try {
        await prisma.player.create({ data: { name, ...opts } });
        console.log('created player in db', name);
    } catch (err) {
        console.error(err, name);
    }
};

const hasCreatedPlayer = async (name: string) => {
    const player = await prisma.player.findUnique({ where: { name: normalizeString(name) } });
    return !!player;
};

export default {
    createPlayerSettings,
    hasCreatedPlayer,
};
