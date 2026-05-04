import type { Standing } from "../../types/league";
import { StandingsRow } from "./StandingsRow";
import { StandingsEmptyState } from "./StandingsEmptyState";

const H = ["Posició", "Username", "Estatus", "Llenguatge", "Punts"];
type Props = { standings: Standing[]; startPosition?: number; highlighted?: boolean };

export const StandingsTable = ({ standings, startPosition = 1, highlighted = false }: Props) => {
  if (!standings || standings.length === 0) return <StandingsEmptyState />;
  const rows = standings.map((s, i) => <StandingsRow key={s.username} standing={s} position={startPosition + i} />);
  const ths = H.map((h) => <th key={h} className="py-3 px-4 text-center font-semibold text-[14px] text-black">{h}</th>);
  return highlighted ? (
    <div className="w-full overflow-x-auto border-2 border-blue-400 rounded-lg">
      <table className="w-full table-fixed"><thead><tr>{ths}</tr></thead><tbody>{rows}</tbody></table>
    </div>
  ) : (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-5 px-4 pb-2">{H.map((h) => <span key={h} className="text-center font-semibold text-[14px] text-black">{h}</span>)}</div>
      <div className="border-2 border-gray-400 rounded-lg overflow-hidden"><table className="w-full table-fixed"><tbody>{rows}</tbody></table></div>
    </div>
  );
};
