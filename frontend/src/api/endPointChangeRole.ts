import { API_URL, END_POINTS } from "../config";

interface RoleChangeRequest {
  github_id: number;
  role: string;
}

interface RoleChangeResponse {
  message: string;
  role: {
    github_id: number;
    role: string;
  };
}

const changeRole = async (
  body: RoleChangeRequest,
): Promise<RoleChangeResponse> => {
  const controller = new AbortController();
  const signal = controller.signal;
  const timeout = setTimeout(() => controller.abort(), 10000);

  const token = localStorage.getItem("auth_token");

  try {
    const url = `${API_URL}${END_POINTS.devTools.roleChange}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Succesful
    if (data && typeof data === "object") {
      if (
        data.message &&
        data.role &&
        typeof data === "object" &&
        "github_id" in data.role &&
        "role" in data.role
      ) {
        return data as RoleChangeResponse;
      }

      if (data.error) {
        throw new Error(`API Error: ${data.error}`);
      }
    }

    //  Unexpected
    throw new Error("Unexpected response from API.");
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.warn("Petition cancelled.");
    }
    console.error("changeRole error:", error);
    throw error;
  }
};

export type { RoleChangeRequest, RoleChangeResponse };
export { changeRole };
