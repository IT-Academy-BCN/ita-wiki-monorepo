import { Ranking } from "../../types/league";
import { AddLeaguePoints } from "./AddLeaguePoints";
import { LeagueList } from "./LeagueList";

export const GlobalRanking = () => {
  const mockData: Ranking[] = [
    {
      position: 1,
      user_id: 101,
      username: "Jordi",
      points: 115,
      points_weekly: 30,
      status: "Junior developer",
      language: "React",
      created_at: "2026-04-24T00:00:00Z",
      updated_at: "2026-04-24T00:00:00Z",
      league_id: 1,
    },
    {
      position: 2,
      user_id: 102,
      username: "Laia",
      points: 105,
      points_weekly: 20,
      status: "Junior developer",
      language: "React",
      created_at: "2026-04-24T00:00:00Z",
      updated_at: "2026-04-24T00:00:00Z",
      league_id: 2,
    },
    {
      position: 3,
      user_id: 103,
      username: "Marc",
      points: 99,
      points_weekly: 10,
      status: "Junior developer",
      language: "React",
      created_at: "2026-04-24T00:00:00Z",
      updated_at: "2026-04-24T00:00:00Z",
      league_id: 2,
    },
  ];

  return (
    <section>
      <h1>Classificació general</h1>
      <LeagueList standings={mockData} />
      <AddLeaguePoints />
    </section>
  );
};
