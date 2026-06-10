import { FC } from "react";

interface PointsHistoryRow {
  date: string;
  pointsEarned: number;
  activitiesCompleted: string;
}

const mockData: PointsHistoryRow[] = [
  { date: "01/06/2025", pointsEarned: 10, activitiesCompleted: "Exercici 1" },
  { date: "05/06/2025", pointsEarned: 20, activitiesCompleted: "Exercici 2" },
  { date: "10/06/2025", pointsEarned: 15, activitiesCompleted: "Exercici 3" },
];

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
