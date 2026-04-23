export type LeagueLanguage = 'Java' | 'PHP' | 'Javascript' | 'Data';

export type LigaType = 'general' | 'oro' | 'plata' | 'bronce';

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

export type League = {
  id: LigaType;
  name: string;
  topPlayers: Player[];
  standings: Standing[];
};

export type LeagueResponse = {
  view: LeagueView;
  week: string | null;
  leagues: League[];
};
