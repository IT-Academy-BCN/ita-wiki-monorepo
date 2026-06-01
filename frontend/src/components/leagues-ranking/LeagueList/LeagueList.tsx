import { UserCheck } from "lucide-react";
import { useUserContext } from "../../../context/UserContext";
import type { LeagueListProps } from "../../../types/league";

export const LeagueList = ({
  standings,
  showUp,
  showDown,
}: LeagueListProps) => {
  const { user } = useUserContext();
  const demoUser = user ? { ...user, id: 8 } : user;
  const getStyle = (index: number) => {
    const base =
      "grid grid-cols-6 border-b last:border-b-0 border-gray-400 px-4 py-4 text-sm text-center text-slate-950";

    const color =
      showUp && standings.length > 3 && index < 3
        ? "bg-green-100"
        : showDown && standings.length > 6 && index >= standings.length - 3
          ? "bg-red-100"
          : "";

    return `${base} ${color}`.trim();
  };

  return (
    <article className="w-full max-w-3xl">
      <div className="grid grid-cols-6 px-4 py-3 text-sm text-center font-bold text-slate-950">
        <div>Posició</div>
        <div>Nom</div>
        <div className="col-span-2">Estatus</div>
        <div>Llenguatge</div>
        <div>Punts</div>
      </div>

      <div className="border border-gray-400 bg-white rounded-xl overflow-clip">
        {standings.map((standing, index) => (
          <div
            key={standing.username}
            className={getStyle(index)}
            data-testid={`league-position-${index + 1}`}
          >
            <div>{index + 1}</div>
            <div className="flex items-center gap-2 justify-center">
              {demoUser?.id === standing.user_id && (
                <UserCheck size={18} strokeWidth={2.5} />
              )}
              {standing.username}
            </div>
            <div className="col-span-2">{standing.status}</div>
            <div>{standing.language}</div>
            <div className="font-bold">
              {standing.points || standing.points_weekly}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};
