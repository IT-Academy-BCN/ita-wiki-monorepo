import type { Liga } from "../../types/league";
const rc = (p: number) =>
  p <= 3 ? "bg-[#d1fae5]" : p >= 8 ? "bg-[#ffe4e6]" : "bg-white";
const td = "py-3 px-4 text-center text-[14px]";
export const StandingsRow = ({ liga }: { liga: Liga }) => (
  <tr className={`${rc(liga.position)} border-b border-gray-200`}>
    <td className={`${td} font-semibold`}>{liga.position}</td>
    <td className={td}>User_{liga.user_id}</td>
    <td className={`${td} text-gray-500`}>—</td>
    <td className={`${td} text-gray-500`}>—</td>
    <td className={`${td} font-semibold`}>{liga.points}</td>
  </tr>
);
