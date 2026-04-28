import type { Standing } from "../../types/league";
import { StandingsRow } from "./StandingsRow";

export const StandingsTable = ({ standings }: { standings: Standing[] }) => {
  if (!standings) return null;

  return (
    <div className="w-full">
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
              Llenguatge
            </th>
            <th className="text-center font-semibold text-[14px] text-black pb-2 w-1/4">
              Punts
            </th>
          </tr>
        </thead>
      </table>
      <div className="overflow-x-auto">
        <div className="border-2 border-gray-400 rounded-lg overflow-hidden">
          <table className="w-full table-fixed">
            <tbody>
              {standings.map((standing, index) => (
                <StandingsRow
                  key={index}
                  standing={standing}
                  position={index + 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
