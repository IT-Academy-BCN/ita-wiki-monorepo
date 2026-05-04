import type { LigaResponse } from "../types/league";

const mockData: LigaResponse = [
  { position: 1, user_id: 101, points: 94, created_at: "", updated_at: "" },
  { position: 2, user_id: 102, points: 88, created_at: "", updated_at: "" },
  { position: 3, user_id: 103, points: 75, created_at: "", updated_at: "" },
  { position: 4, user_id: 104, points: 70, created_at: "", updated_at: "" },
  { position: 5, user_id: 105, points: 65, created_at: "", updated_at: "" },
  { position: 6, user_id: 106, points: 60, created_at: "", updated_at: "" },
  { position: 7, user_id: 107, points: 55, created_at: "", updated_at: "" },
  { position: 8, user_id: 108, points: 50, created_at: "", updated_at: "" },
  { position: 9, user_id: 109, points: 40, created_at: "", updated_at: "" },
  { position: 10, user_id: 110, points: 30, created_at: "", updated_at: "" },
];

export async function getLeagueRanking(): Promise<LigaResponse> {
  return Promise.resolve(mockData);
}
