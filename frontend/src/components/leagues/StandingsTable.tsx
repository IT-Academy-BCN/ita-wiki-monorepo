import { Standing } from "../../types/league";
import { StandingsRow } from "./StandingsRow";
import { StandingsTableSkeleton } from "./StandingsTableSkeleton";
import { StandingsEmptyState } from "./StandingsEmptyState";

type StandingsTableProps = {
  standings: Standing[] | null;
  isLoading: boolean;
};

export const StandingsTable = ({
  standings,
  isLoading,
}: StandingsTableProps) => {
  if (isLoading) {
    return <StandingsTableSkeleton />;
  }

  if (!standings || standings.length === 0) {
    return <StandingsEmptyState />;
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Posició</th>
          <th>Usuari</th>
          <th>Estat</th>
          <th>Llenguatge</th>
          <th>Punts</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((row, index) => (
          <StandingsRow
            key={row.username}
            standing={row}
            position={index + 1}
            totalRows={standings.length}
          />
        ))}
      </tbody>
    </table>
  );
};
