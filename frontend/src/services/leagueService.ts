import type { LigaResponse } from "../types/league";
import { leagueMockData } from "../data/leagueMock";

export async function getLeagueRanking(): Promise<LigaResponse> {
  return Promise.resolve(leagueMockData);
}
