export type Liga = {
  position: number;
  user_id: number;
  username: string;
  points_weekly: number;
  league_id: number;
};

export type LigaResponse = { [key: string]: Liga[] };

export type LeagueListProps = {
  standings: Omit<Ranking, "points_weekly" | "league_id">[];
};

export type Ranking = {
  position: number;
  user_id: number;
  username: string;
  created_at: string;
  updated_at: string;
  points: number;
  points_weekly: number;
  status: string;
  language: string;
  league_id: number;
};
