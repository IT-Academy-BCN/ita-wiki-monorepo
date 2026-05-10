import { useState } from "react";

export type AddLeaguePointsResponse = {
  user_id: number;
  points: number;
};

type UseAddLeaguePointsParams = {
  addLeaguePoints: (userId: number) => Promise<AddLeaguePointsResponse>;
};

type UseAddLeaguePointsReturn = {
  addPoints: (userId: number) => Promise<AddLeaguePointsResponse | null>;
  error: string | null;
  isLoading: boolean;
};

export const useAddLeaguePoints = ({
  addLeaguePoints,
}: UseAddLeaguePointsParams): UseAddLeaguePointsReturn => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addPoints = async (
    userId: number,
  ): Promise<AddLeaguePointsResponse | null> => {
    setError(null);
    setIsLoading(true);

    try {
      return await addLeaguePoints(userId);
    } catch {
      setError("No s'han pogut sumar els punts.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addPoints,
    error,
    isLoading,
  };
};
