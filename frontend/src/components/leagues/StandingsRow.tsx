import { Standing } from "../../types/league";

type StandingsRowProps = {
  standing: Standing;
  position: number;
  totalRows: number;
};

const isHighlightedTop = (position: number) => position <= 3;

const isHighlightedLow = (position: number, totalRows: number) => {
  return position > totalRows - 3;
};

export const StandingsRow = ({ standing, position, totalRows }: StandingsRowProps) => {
  const highlightedTop = isHighlightedTop(position);
  const highlightedLow = isHighlightedLow(position, totalRows);

  let rowClassName = "standings-row";

  if (highlightedTop) {
    rowClassName = "standings-row standings-row--top";
  } else if (highlightedLow) {
    rowClassName = "standings-row standings-row--danger";
  }

  return (
    <tr className={rowClassName}>
      <td>{position}</td>
      <td>{standing.username}</td>
      <td>{standing.status}</td>
      <td>{standing.language}</td>
      <td>{standing.points}</td>
    </tr>
  );
};
