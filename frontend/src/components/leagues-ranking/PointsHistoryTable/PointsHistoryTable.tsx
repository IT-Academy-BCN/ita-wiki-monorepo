import { FC } from "react";

interface PointsHistoryRow {
  date: string;
  pointsEarned: number;
  activitiesCompleted: string;
}

const mockData: PointsHistoryRow[] = [];

const PointsHistoryTable: FC = () => {
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
        {mockData.map((row, index) => (
          <tr
            key={index}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
          >
            <td className="px-4 py-3 text-center">{row.date}</td>
            <td className="px-4 py-3 text-center">{row.pointsEarned}</td>
            <td className="px-4 py-3 text-center">{row.activitiesCompleted}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PointsHistoryTable;
