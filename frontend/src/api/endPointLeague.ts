import { API_URL, END_POINTS } from "../config";

export type AddLeaguePointsResponse = {
  user_id: number;
  points: number;
};

export const addLeaguePoints = async (
  userId: number,
  points: number,
): Promise<AddLeaguePointsResponse> => {
  const url = `${API_URL}${END_POINTS.leagues.addPoints}/${userId}/points`;
  const token = localStorage.getItem("auth_token");

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ points: points }),
  });

  if (!response.ok) {
    throw new Error("Error adding league points");
  }

  return (await response.json()) as AddLeaguePointsResponse;
};
