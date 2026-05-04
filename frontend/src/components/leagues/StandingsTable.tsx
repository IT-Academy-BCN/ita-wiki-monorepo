import type { Liga } from "../../types/league";
import { StandingsRow } from "./StandingsRow";
const H = ["Posició", "Username", "Estatus", "Llengua", "Punts"];
type Props = { ligas: Liga[]; highlighted?: boolean };
export const StandingsTable = ({ ligas, highlighted = false }: Props) => {
  if (!ligas.length)
    return <p className="text-center text-gray-400 py-4">No hi han dades</p>;
  const rows = ligas.map((l) => <StandingsRow key={l.user_id} liga={l} />);
  const ths = H.map((h) => (
    <th key={h} className="py-3 px-4 text-center font-semibold text-[14px]">
      {h}
    </th>
  ));
  return highlighted ? (
    <div className="w-full overflow-x-auto border-2 border-blue-400 rounded-lg">
      <table className="w-full table-fixed">
        <thead>
          <tr>{ths}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  ) : (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-5 px-4 pb-2">
        {H.map((h) => (
          <span key={h} className="text-center font-semibold text-[14px]">
            {h}
          </span>
        ))}
      </div>
      <div className="border-2 border-gray-400 rounded-lg overflow-hidden">
        <table className="w-full table-fixed">
          <tbody>{rows}</tbody>
        </table>
      </div>
    </div>
  );
};
