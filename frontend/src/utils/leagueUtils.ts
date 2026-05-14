import { Ranking } from "../types/league";

export const groupByLeague = (
  globalRanking: Ranking[],
): [string, Omit<Ranking, "points_weekly">[]][] => {
  const leagues: Record<string, Omit<Ranking, "points_weekly">[]> = {};
  for (const entry of globalRanking) {
    const id = entry.league_id;
    if (!leagues[id]) leagues[id] = [];
    leagues[id].push({
      position: entry.position,
      user_id: entry.user_id,
      username: entry.username,
      points: entry.points_weekly, // <-- your mapping
      status: entry.status,
      language: entry.language,
      created_at: entry.created_at,
      updated_at: entry.updated_at,
      league_id: entry.league_id,
    });
  }
  return Object.entries(leagues);
};
