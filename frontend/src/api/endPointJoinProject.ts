import { API_URL } from "../config";

import type { ProgrammingRole } from "../types/codeConnectTypes";

export async function joinProject(
  listProjectId: number,
  programmingRole: ProgrammingRole,
): Promise<unknown | null> {
  const url = `${API_URL}codeconnect/${listProjectId}/join`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ programming_role: programmingRole }),
  });

  if (!response.ok) {
    console.warn("Failed to join project (non-ok response)", response.status);
    return null;
  }

  return response.json();
}
