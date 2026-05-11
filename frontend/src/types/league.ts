export type Liga = {
  position: number;
  user_id: number;
  username: string;
  points: number;
  weekly_points: number;
  created_at: string;
  updated_at: string;
};

export type LigaResponse = Liga[];

export type LeagueListProps = {
  standings: Liga[];
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