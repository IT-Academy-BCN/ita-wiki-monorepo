// Matches the confirmed backend response for GET /api/ligas/ranking
// id is intentionally not exposed — user_id uniquely identifies the entry
// username, avatar_url pending JOIN with users table (future sprint)
export type Liga = {
  position: number;
  user_id: number;
  points: number;
  created_at: string;
  updated_at: string;
};

export type LigaResponse = Liga[];

// UI type for StandingsTable
// username will be added when backend confirms JOIN with users table
export type Standing = {
  position: number;
  user_id: number;
  points: number;
};
