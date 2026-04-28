export type LeagueLanguage = 'Java' | 'PHP' | 'Javascript' | 'Data';

export type LigaType = 'general';

export type LeagueView = 'weekly' | 'global';

export type Player = {
  position: number;
  username: string;
  avatarUrl: string;
  title: string;
  points: number;
};

export type Standing = {
  position: number;
  username: string;
  status: string;
  language: LeagueLanguage;
  points: number;
};

export interface League {
  id: number;
  user_id: number;
  points: number;
  created_at: string;
  updated_at: string;
}

export type LeagueResponse = {
  view: LeagueView;
  week: string | null;
  leagues: League[];
};
