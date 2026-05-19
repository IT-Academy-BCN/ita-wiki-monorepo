import { API_URL, END_POINTS } from "../config";
import type { ApiContributor } from "../types/codeConnectTypes";

export const fetchProjectContributors = async (
  projectId: number,
): Promise<ApiContributor[]> => {
  const url = `${API_URL}${END_POINTS.codeconnect.get}/${projectId}/contributors`;
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];
    const data = (await response.json()) as { data: ApiContributor[] };
    return data.data ?? [];
  } catch {
    return [];
  }
};

export const updateContributorStatus = async (
  projectId: number,
  contributorId: number,
  status: "accepted" | "rejected",
): Promise<boolean> => {
  const token = localStorage.getItem("auth_token");
  const url = `${API_URL}${END_POINTS.codeconnect.get}/${projectId}/contributors/${contributorId}/status`;
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return response.ok;
  } catch {
    return false;
  }
};
