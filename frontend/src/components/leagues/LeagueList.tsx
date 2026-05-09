type LeagueStanding = {
  username: string;
  points: number;
};

type LeagueListProps = {
  standings: LeagueStanding[];
};

export const LeagueList = ({ standings }: LeagueListProps) => {
  return (
    <article className="w-full max-w-3xl">
      <div className="w-full">
        <div className="grid grid-cols-[1fr_2fr_1fr] border-b-2 border-pink-600 px-4 py-3 text-sm font-bold text-slate-950">
          <div>Posició</div>
          <div>Nom</div>
          <div>Punts</div>
        </div>

        {standings.map((standing, index) => (
          <div
            key={standing.username}
            className="grid grid-cols-[1fr_2fr_1fr] border-b border-slate-300 px-4 py-4 text-sm text-slate-950"
            data-testid={`league-position-${index + 1}`}
          >
            <div>{index + 1}</div>
            <div>{standing.username}</div>
            <div className="font-bold">{standing.points}</div>
          </div>
        ))}
      </div>
    </article>
  );
};
