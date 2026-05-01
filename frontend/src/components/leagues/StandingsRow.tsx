import type { Standing } from "../../types/league";
import { TOP_RANGE, DANGER_RANGE } from "../../config/rankingConfig";

type StandingsRowProps = {
  standing: Standing;
  position: number;
};

export const StandingsRow = ({ standing, position }: StandingsRowProps) => {
  const rowClass = getRowClass(position);

  return (
    <tr className={`${rowClass} border-b border-gray-400`}>
      <td className="py-3 px-4 text-center text-[14px] text-black">
        {position}
      </td>
      <td className="py-3 px-4 text-center text-[14px] text-black">
        {standing.username}
      </td>
      <td className="py-3 px-4 text-center text-[14px] text-black font-semibold">
        {standing.points}
      </td>
    </tr>
  );
};

function getRowClass(position: number) {
  if (position >= TOP_RANGE.min && position <= TOP_RANGE.max) {
    return "bg-[var(--highlight-top)]";
  }

  if (position >= DANGER_RANGE.min && position <= DANGER_RANGE.max) {
    return "bg-[var(--highlight-danger)]";
  }

  return "bg-white";
}
