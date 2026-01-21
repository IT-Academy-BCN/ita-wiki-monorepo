import { API_URL } from "../config";
import { Like } from "../types";

export const getLikes = async (github_id: number): Promise<Like[]> => {
  const url = `${API_URL}likes/${github_id}`;
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    return await response.json();
  } catch (err) {
    console.error("Error fetching likes:", err);
    return [];
  }
};

export const createLike = async (
  github_id: number,
  resource_id: number,
): Promise<Like | null> => {
  const url = `${API_URL}likes`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ github_id, resource_id }),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.error("Error creating like:", err);
    return null;
  }
};

export const deleteLike = async (
  github_id: number,
  resource_id: number,
): Promise<boolean> => {
  const url = `${API_URL}likes`;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ github_id, resource_id }),
    });

    return response.ok;
  } catch (err) {
    console.error("Error deleting like:", err);
    return false;
  }
};
