import type { League } from "../types/league";

const mockData: League[] = [
  { id: 1, user_id: 10, points: 120, created_at: "", updated_at: "" },
  { id: 2, user_id: 11, points: 95, created_at: "", updated_at: "" },
  { id: 3, user_id: 12, points: 80, created_at: "", updated_at: "" },
  { id: 4, user_id: 13, points: 75, created_at: "", updated_at: "" },
  { id: 5, user_id: 14, points: 73, created_at: "", updated_at: "" },
  { id: 6, user_id: 15, points: 75, created_at: "", updated_at: "" },
  { id: 7, user_id: 16, points: 64, created_at: "", updated_at: "" },
  { id: 8, user_id: 17, points: 60, created_at: "", updated_at: "" },
  { id: 9, user_id: 18, points: 52, created_at: "", updated_at: "" },
  { id: 10, user_id: 19, points: 38, created_at: "", updated_at: "" },
];

export async function getLeagueRanking(): Promise<League[]> {
  return Promise.resolve(mockData);
}
