import type { LeagueResponse, LeagueView } from '../types/league';

const mockData: LeagueResponse = {
  view: 'weekly',
  week: '2026-W17',
  leagues: [
    {
      id: 'general',
      name: 'Liga General',
      standings: [
        { position: 1,  username: 'Dev_14', status: 'Skilled Developer', language: 'Java',       points: 94 },
        { position: 2,  username: 'jsCoder',status: 'Junior Coder',      language: 'PHP',        points: 93 },
        { position: 3,  username: 'Nagumi', status: 'Junior Coder',      language: 'Javascript', points: 79 },
        { position: 4,  username: 'Piluli', status: 'Skilled Developer', language: 'Java',       points: 75 },
        { position: 5,  username: 'Koder',  status: 'Junior Coder',      language: 'PHP',        points: 73 },
        { position: 6,  username: 'Paw3l',  status: 'Junior Coder',      language: 'Javascript', points: 75 },
        { position: 7,  username: 'Vindra', status: 'Expert Hacker',     language: 'Data',       points: 64 },
        { position: 8,  username: 'Koder',  status: 'Junior Coder',      language: 'PHP',        points: 60 },
        { position: 9,  username: 'Paw3l',  status: 'Junior Coder',      language: 'Javascript', points: 52 },
        { position: 10, username: 'Vindra', status: 'Expert Hacker',     language: 'Data',       points: 51 },
      ],
    },
  ],
};


export async function getLeagueRanking(view: LeagueView = 'weekly'): Promise<LeagueResponse> {
  return Promise.resolve({ ...mockData, view });
}
