import { describe, expect, test } from 'vitest';
import { getLeagueRanking } from './leagueService';

describe('leagueService (mock version)', () => {
  test('should return an array', async () => {
    const result = await getLeagueRanking();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  test('each item should have id, user_id and points', async () => {
    const result = await getLeagueRanking();

    result.forEach((liga) => {
      expect(liga).toHaveProperty('id');
      expect(liga).toHaveProperty('user_id');
      expect(liga).toHaveProperty('points');
    });
  });

  test('each item should have created_at and updated_at', async () => {
    const result = await getLeagueRanking();

    result.forEach((liga) => {
      expect(liga).toHaveProperty('created_at');
      expect(liga).toHaveProperty('updated_at');
    });
  });

  test('points should be a number', async () => {
    const result = await getLeagueRanking();

    result.forEach((liga) => {
      expect(typeof liga.points).toBe('number');
    });
  });

  test('should return 10 entries', async () => {
    const result = await getLeagueRanking();

    expect(result.length).toBe(10);
  });
});
