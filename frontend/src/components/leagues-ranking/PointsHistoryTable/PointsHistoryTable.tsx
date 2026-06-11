import { FC } from "react";
import type { PointsHistoryEntry } from "../../../types/league";

interface Props {
  data: PointsHistoryEntry[];
}

const PointsHistoryTable: FC<Props> = ({ data }) => {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-[#B91879] text-white">
          <th className="px-4 py-3 text-center font-semibold">Data</th>
          <th className="px-4 py-3 text-center font-semibold">
            Punts guanyats
          </th>
          <th className="px-4 py-3 text-center font-semibold">
            Activitats realitzades
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={index}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
          >
            <td className="px-4 py-3 text-center">{new Date(row.date).toLocaleDateString("ca-ES")}</td>
            <td className="px-4 py-3 text-center">{row.points}</td>
            <td className="px-4 py-3 text-center">{row.activity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PointsHistoryTable;
