export type PointsHistoryEntry = {
  date: string;
  points: number;
  activity: string;
};

export type Liga = {
  position: number;
  user_id: number;
  username: string;
  points?: number;
  points_weekly: number;
  status?: string;
  language?: string;
  league_id: number;
};

export type LigaResponse = { [key: string]: Liga[] };

export type LeagueListProps = {
  standings: Omit<Ranking, "league_id">[] | Liga[];
  showUp?: boolean;
  showDown?: boolean;
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

export type LeagueNotificationResponse =
  | {
      hasChange: true;
      direction: "up" | "down";
      newLeagueId: number;
      year: number;
      week_number: number;
    }
  | { hasChange: false };
