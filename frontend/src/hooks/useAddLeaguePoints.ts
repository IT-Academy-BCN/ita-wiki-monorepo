import { useState } from "react";

export type AddLeaguePointsResponse = {
  user_id: number;
  points: number;
};

type UseAddLeaguePointsParams = {
  addLeaguePoints: (
    userId: number,
    points: number,
  ) => Promise<AddLeaguePointsResponse>;
};
type PointSystem = { points: number; activity: string }[];

type UseAddLeaguePointsReturn = {
  addPoints: (
    userId: number,
    points: number,
  ) => Promise<AddLeaguePointsResponse | null>;
  error: string | null;
  isLoading: boolean;
  pointSystem: PointSystem;
};

export const useAddLeaguePoints = ({
  addLeaguePoints,
}: UseAddLeaguePointsParams): UseAddLeaguePointsReturn => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addPoints = async (
    userId: number,
    points: number,
  ): Promise<AddLeaguePointsResponse | null> => {
    setError(null);
    setIsLoading(true);

    try {
      return await addLeaguePoints(userId, points);
    } catch {
      setError("No s'han pogut sumar els punts.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const pointSystem: PointSystem = [
    { points: 5, activity: "RESOLUCIÓ DE DUBTES (5 pt)" },
    { points: 10, activity: "CORRECCIÓ DE PR (10 pt)" },
    { points: 20, activity: "PRESENTACIÓ (20 pt)" },
  ];

  return {
    addPoints,
    error,
    isLoading,
    pointSystem,
  };
};
