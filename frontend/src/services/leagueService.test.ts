import { describe, expect, test } from 'vitest';
import { getLeagueRanking } from './leagueService';

describe('leagueService (mock version)', () => {
  test('should return a LeagueResponse object', async () => {
    const result = await getLeagueRanking();

    expect(result).toHaveProperty('view');
    expect(result).toHaveProperty('week');
    expect(result).toHaveProperty('leagues');
  });

  test('leagues should be a non-empty array', async () => {
    const result = await getLeagueRanking();

    expect(Array.isArray(result.leagues)).toBe(true);
    expect(result.leagues.length).toBeGreaterThan(0);
  });

  test('each league should have id, name, topPlayers and standings', async () => {
    const result = await getLeagueRanking();

    result.leagues.forEach((league) => {
      expect(league).toHaveProperty('id');
      expect(league).toHaveProperty('name');
      expect(league).toHaveProperty('topPlayers');
      expect(league).toHaveProperty('standings');
    });
  });

  test('topPlayers should have position, username, avatarUrl, title and points', async () => {
    const result = await getLeagueRanking();
    const topPlayers = result.leagues[0].topPlayers;

    topPlayers.forEach((player) => {
      expect(player).toHaveProperty('position');
      expect(player).toHaveProperty('username');
      expect(player).toHaveProperty('avatarUrl');
      expect(player).toHaveProperty('title');
      expect(player).toHaveProperty('points');
    });
  });

  test('standings should have position, username, status, language and points', async () => {
    const result = await getLeagueRanking();
    const standings = result.leagues[0].standings;

    standings.forEach((standing) => {
      expect(standing).toHaveProperty('position');
      expect(standing).toHaveProperty('username');
      expect(standing).toHaveProperty('status');
      expect(standing).toHaveProperty('language');
      expect(standing).toHaveProperty('points');
    });
  });

  test('should respect the view parameter', async () => {
    const weekly = await getLeagueRanking('weekly');
    const global = await getLeagueRanking('global');

    expect(weekly.view).toBe('weekly');
    expect(global.view).toBe('global');
  });

  test('language in standings should be a valid enum value', async () => {
    const result = await getLeagueRanking();
    const validLanguages = ['Java', 'PHP', 'Javascript', 'Data'];

    result.leagues[0].standings.forEach((standing) => {
      expect(validLanguages).toContain(standing.language);
    });
  });
});
