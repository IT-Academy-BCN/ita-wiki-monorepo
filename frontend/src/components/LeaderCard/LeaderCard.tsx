import { FC, useState } from 'react';
import clsx from 'clsx';
import type { Player } from '../../types/league';

type CupType = 'gold' | 'silver' | 'bronze';

interface LeaderCardProps {
  player: Player;
  cupType: CupType;
}

const cupStyles: Record<CupType, string> = {
  gold:   'text-yellow-400',
  silver: 'text-gray-400',
  bronze: 'text-amber-600',
};

const cupIcons: Record<CupType, string> = {
  gold:   '🏆',
  silver: '🥈',
  bronze: '🥉',
};

const borderStyles: Record<CupType, string> = {
  gold:   'border-yellow-400',
  silver: 'border-gray-400',
  bronze: 'border-amber-600',
};

const getInitials = (username: string) =>
  username.slice(0, 2).toUpperCase();

const LeaderCard: FC<LeaderCardProps> = ({ player, cupType }) => {
  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2 bg-white rounded-xl border border-gray-200 px-6 py-4 shadow-sm min-w-[180px]">
      <span className={clsx('text-2xl', cupStyles[cupType])} aria-label={`${cupType} cup`}>
        {cupIcons[cupType]}
      </span>

      <div
        className={clsx(
          'w-14 h-14 rounded-full border-2 flex items-center justify-center overflow-hidden',
          borderStyles[cupType],
        )}
      >
        {!avatarError && player.avatarUrl ? (
          <img
            src={player.avatarUrl}
            alt={`${player.username} avatar`}
            className="w-full h-full object-cover"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <span className="text-sm font-bold text-gray-600">
            {getInitials(player.username)}
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500">{player.title}</p>
      <p className="font-bold text-sm">{player.username}</p>
      <p className="text-xs text-gray-500">
        Puntos ganados: <span className="font-bold text-gray-800">{player.points}</span>
      </p>
    </div>
  );
};

export default LeaderCard;
