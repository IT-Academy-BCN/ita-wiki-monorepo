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
  const [addedPoints, setAddedPoints] = useState<number | null>(null);

  const { addPoints, error, isLoading, pointSystem } = useAddLeaguePoints({
    addLeaguePoints,
  });

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!selectedUsername || !addedPoints) {
      return;
    }

    await addPoints(Number(selectedUsername), addedPoints);
    setSelectedUsername("");
    setAddedPoints(null);
  };

  return (
    <form
      className="mt-8"
      onSubmit={handleSubmit}
      aria-label="add league points"
    >
      <h1>Afegir punts</h1>
      <div className="flex gap-3 md:items-center">
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

        {pointSystem.map((item, index) => (
          <button
            key={index}
            className="flex-1 bg-[#B91879] px-5 py-3 text-xs font-bold uppercase text-white hover:shadow-md disabled:cursor-not-allowed"
            disabled={!selectedUsername || isLoading}
            type="submit"
            onClick={() => setAddedPoints(item.points)}
          >
            {isLoading ? "Sumant..." : item.activity}
          </button>
        ))}
      </div>

      {error && <p>{error}</p>}
    </form>
  );
};
