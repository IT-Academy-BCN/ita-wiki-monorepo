import { StandingsRow } from "./StandingsRow";
import { StandingsEmptyState } from "./StandingsEmptyState";

export const StandingsTable = ({
  standings,
}: {
  standings: {
    position: number;
    username: string;
    points: number;
  }[];
}) => {
  if (standings.length === 0) {
    return <StandingsEmptyState />;
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="border-2 border-gray-400 rounded-lg overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr>
              <th className="text-center font-semibold text-[14px] text-black pb-2 w-1/4">
                Posició
              </th>
              <th className="text-center font-semibold text-[14px] text-black pb-2 w-1/4">
                Nom
              </th>
              <th className="text-center font-semibold text-[14px] text-black pb-2 w-1/4">
                Punts
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.map((standing) => (
              <StandingsRow
                key={standing.position}
                standing={standing}
                position={standing.position}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
