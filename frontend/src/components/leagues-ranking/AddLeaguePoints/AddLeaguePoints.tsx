import { FormEvent, JSX, useState } from "react";

import { addLeaguePoints } from "../../../api/endPointLeague";
import { useAddLeaguePoints } from "../../../hooks/useAddLeaguePoints";

type AddLeaguePointsUser = {
  user_id: number;
  username: string;
};

type AddLeaguePointsProps = {
  users: AddLeaguePointsUser[];
};

export const AddLeaguePoints = ({
  users,
}: AddLeaguePointsProps): JSX.Element => {
  const [selectedUsername, setSelectedUsername] = useState<string>("");

  const { addPoints, error, isLoading } = useAddLeaguePoints({
    addLeaguePoints,
  });

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!selectedUsername) {
      return;
    }

    await addPoints(Number(selectedUsername));
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

          {users.map((user) => (
            <option key={user.user_id} value={user.user_id}>
              {user.username}
            </option>
          ))}
        </select>

        <button
          className="w-fit bg-[#B91879] px-5 py-3 text-xs font-bold uppercase text-white hover:shadow-md disabled:cursor-not-allowed"
          disabled={!selectedUsername || isLoading}
          type="submit"
        >
          {isLoading ? "Sumant..." : "Sumar punts"}
        </button>
      </div>

      {error && <p>{error}</p>}
    </form>
  );
};
