import { getHtmlIfPathHasNotBeenProcessed } from './data';
import { parse } from 'node-html-parser';
import { getPlayerSettingsFromName } from './player';
import respectRateLimit from './respect-rate-limit';
import { normalizeString } from './utils';

const fetchAndSavePlayerSettingsFromNames = async ([names, teamName]: [
    names: (string | undefined)[],
    teamName: string,
]): Promise<void> => {
    if (names.length === 0) return;

    const name = names.pop();

    if (!name) return;

    const { fromCache } = await getPlayerSettingsFromName(name, teamName);

    return respectRateLimit({ data: [names, teamName], fromCache }, fetchAndSavePlayerSettingsFromNames);
};

export const fetchAndSavePlayerSettingsFromTeamName = async (name: string): Promise<void> => {
    const { data, fromCache } = await getHtmlIfPathHasNotBeenProcessed('teams', name);

    if (!data) return;

    const html = parse(data);
    const playerNames = Array.from(
        new Set(
            html
                .querySelectorAll('tr[class="Player"] td span a[href][title]')
                .map((el) => el.getAttribute('href')?.replace('/counterstrike/', ''))
                .filter((el) => !!el && !el.includes('.php') && !/gaming|team|esports|e-sports|orgless/i.test(el))
        )
    );

    const normalizedTeamName = normalizeString(name);

    console.log('found ' + playerNames.length + ' potential players for team ' + normalizedTeamName);

    await respectRateLimit({ data: [playerNames, normalizedTeamName], fromCache }, fetchAndSavePlayerSettingsFromNames);
};
