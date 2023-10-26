import { DataResult, getHtmlIfPathHasNotBeenProcessed } from './data';
import { parse } from 'node-html-parser';

export const getTeamNamesFromPortal = async (): Promise<DataResult<string[]>> => {
    const { data, fromCache } = await getHtmlIfPathHasNotBeenProcessed('portal', 'Portal:Teams');

    if (!data) {
        return {
            data: [],
            fromCache,
        };
    }

    const html = parse(data);
    const teamNames = html
        .querySelectorAll('span[class="team-template-text"] a[href][title]')
        .map((e) => e.getAttribute('href')?.replace('/counterstrike/', '')) as string[];

    console.log('found ' + teamNames.length + ' teams');

    return { data: teamNames, fromCache };
};
