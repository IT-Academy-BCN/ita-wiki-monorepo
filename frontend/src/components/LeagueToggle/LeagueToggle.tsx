import { FC } from 'react';
import clsx from 'clsx';

export type LeagueView = 'weekly' | 'global';

interface LeagueToggleProps {
  view: LeagueView;
  onChange: (view: LeagueView) => void;
}

const options: { label: string; value: LeagueView }[] = [
  { label: 'Liga semanal',    value: 'weekly' },
  { label: 'Ranking general', value: 'global' },
];

const LeagueToggle: FC<LeagueToggleProps> = ({ view, onChange }) => {
  return (
    <div className="flex gap-2" role="group" aria-label="League view selector">
      {options.map((option) => {
        const isActive = view === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={clsx(
              'px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200',
              isActive
                ? 'bg-[#B91879] text-white'
                : 'border border-gray-300 text-gray-800 bg-white hover:bg-gray-100',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default LeagueToggle;
