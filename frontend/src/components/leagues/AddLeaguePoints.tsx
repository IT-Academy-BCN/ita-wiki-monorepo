import { FormEvent, JSX, useState } from "react";

type AddLeaguePointsProps = {
  usernames?: string[];
};

const defaultUsernames = ["Jordi", "Laia", "Marc"];

export const AddLeaguePoints = ({
  usernames = defaultUsernames,
}: AddLeaguePointsProps): JSX.Element => {
  const [selectedUsername, setSelectedUsername] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSelectedUsername("");
  };

  return (
    <form className="mt-8" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <select
          className="min-h-[40px] border border-gray-600 px-3 py-2 text-xs uppercase text-gray-700 focus:border-[#B91879] focus:outline-none focus:ring-1 focus:ring-[#B91879]"
          id="league-username"
          name="league-username"
          onChange={(event) => setSelectedUsername(event.target.value)}
          value={selectedUsername}
        >
          <option value="">Username, user ID...</option>

          {usernames.map((username) => (
            <option key={username} value={username}>
              {username}
            </option>
          ))}
        </select>

        <button
          className="w-fit bg-[#B91879] px-5 py-3 text-xs font-bold uppercase text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!selectedUsername}
          type="submit"
        >
          Sumar punts
        </button>
      </div>
    </form>
  );
};
