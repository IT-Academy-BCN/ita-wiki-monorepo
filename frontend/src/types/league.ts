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