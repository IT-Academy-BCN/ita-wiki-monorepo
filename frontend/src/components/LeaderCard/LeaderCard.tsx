import { FC, useState } from "react";
import clsx from "clsx";

export type CupType = "gold" | "silver" | "bronze";
export type LeaderCardPlayer = {
  user_id: number;
  username: string;
  avatarUrl: string;
  title: string;
  points: number;
};

const cups: Record<CupType, { icon: string; text: string; border: string }> = {
  gold: { icon: "🏆", text: "text-yellow-400", border: "border-yellow-400" },
  silver: { icon: "🥈", text: "text-gray-400", border: "border-gray-400" },
  bronze: { icon: "🥉", text: "text-amber-600", border: "border-amber-600" },
};

const LeaderCard: FC<{ player: LeaderCardPlayer; cupType: CupType }> = ({
  player,
  cupType,
}) => {
  const [imgError, setImgError] = useState(false);
  const { icon, text, border } = cups[cupType];

  return (
    <div className="flex flex-col items-center gap-2 bg-white rounded-xl border border-gray-200 px-6 py-4 shadow-sm min-w-[180px]">
      <span className={clsx("text-2xl", text)} aria-label={`${cupType} cup`}>
        {icon}
      </span>
      <div
        className={clsx(
          "w-14 h-14 rounded-full border-2 flex items-center justify-center overflow-hidden",
          border,
        )}
      >
        {!imgError && player.avatarUrl ? (
          <img
            src={player.avatarUrl}
            alt={`${player.username} avatar`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-sm font-bold text-gray-600">
            {player.username.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500">{player.title}</p>
      <p className="font-bold text-sm">{player.username}</p>
      <p className="text-xs text-gray-500">
        Punts guanyats:{" "}
        <span className="font-bold text-gray-800">{player.points}</span>
      </p>
    </div>
  );
};

export default LeaderCard;
