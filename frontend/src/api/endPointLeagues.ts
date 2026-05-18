import { API_URL, END_POINTS } from "../config";

export const fetchGlobalRanking = async (signal?: AbortSignal) => {
  const url = `${API_URL}${END_POINTS.leagues.get}`;
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error("Failed to fetch ranking");
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError")
      throw error;
    console.error(error);
    throw error;
  }
};
