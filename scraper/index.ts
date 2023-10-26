import { fetchAndSavePlayerSettingsFromTeamName } from './team';
import { getTeamNamesFromPortal } from './portal';
import { createCacheFoldersIfNotExists } from './utils';
import respectRateLimit from './respect-rate-limit';

const getPlayerSettings = async (teams: string[], originalLength: number | null = null, count = 0): Promise<void> => {
    if (teams.length === 0) return;

    if (originalLength === null) originalLength = teams.length;

    const teamName = teams.pop();

    if (!teamName) return;

    console.log('fetching player settings for team', teamName);

    console.log(`${count} of ${originalLength} teams done`);

    await fetchAndSavePlayerSettingsFromTeamName(teamName);

    return getPlayerSettings(teams, originalLength, count + 1);
};

const main = async () => {
    await createCacheFoldersIfNotExists();

    const teamResult = await getTeamNamesFromPortal();

    if (!teamResult.data.length) {
        console.log('No teams found');
        return;
    }

    await respectRateLimit(teamResult, getPlayerSettings);
};

if (require.main === module) {
    main().then(() => console.log('data processing done'));
}
