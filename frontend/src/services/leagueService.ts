import type { LigaResponse } from "../types/league";

const mockData: LigaResponse = [
  {
    position: 1,
    user_id: 101,
    points: 94,
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
  {
    position: 2,
    user_id: 102,
    points: 88,
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
  {
    position: 3,
    user_id: 103,
    points: 75,
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
];

export async function getLeagueRanking(
  _view: "weekly" | "global" = "global",
): Promise<LigaResponse> {
  return Promise.resolve(mockData);
}
