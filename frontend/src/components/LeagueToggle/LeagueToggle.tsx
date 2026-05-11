import clsx from "clsx";
import { FC } from "react";

export type LeagueView = "weekly" | "global";

type Props = { view: LeagueView; onChange: (v: LeagueView) => void };

const options = [
  { label: "Lliga setmanal", value: "weekly" as LeagueView },
  { label: "Classificació general", value: "global" as LeagueView },
];

const LeagueToggle: FC<Props> = ({ view, onChange }) => (
  <div
    className="flex gap-2"
    role="group"
    aria-label="League view selector"
  >
    {options.map(({ label, value }) => (
      <button
        key={value}
        type="button"
        onClick={() => onChange(value)}
        aria-pressed={view === value}
        className={clsx(
          "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
          view === value
            ? "bg-[#B91879] text-white"
            : "text-gray-800 hover:bg-gray-100",
        )}
      >
        {label}
      </button>
    ))}
  </div>
);

export default LeagueToggle;
