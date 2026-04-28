// Matches the confirmed backend schema for this sprint
// username, avatar_url, title etc. are pending JOIN with users table
export type Liga = {
  id: number;
  user_id: number;
  points: number;
  created_at: string;
  updated_at: string;
};

export type LigaResponse = Liga[];

// UI type for StandingsTable — matches confirmed backend fields
// username will be added when backend confirms JOIN with users table
export type Standing = {
  user_id: number;
  points: number;
};
