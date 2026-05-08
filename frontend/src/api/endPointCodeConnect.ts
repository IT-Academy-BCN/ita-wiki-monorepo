import { API_URL, END_POINTS } from "../config";
import type { IntCodeConnect } from "../types";
import type {
  ApiProjectResponse,
  ApiProjectsResponse,
  ApiContributor,
} from "../types/codeConnectTypes";

export type CodeConnectError = {
  message: string;
  status?: number;
  code?: string;
};

export const createCodeConnect = async (
  formData: Omit<IntCodeConnect, "time" | "unitTime">,
  signal?: AbortSignal,
) => {
  const url = `${API_URL}${END_POINTS.codeconnect.post}`;
  const token = localStorage.getItem("auth_token");
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
      signal,
    });

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      let errorCode: string | undefined;

      try {
        const errorData = (await response.json()) as {
          message?: string;
          code?: string;
        };

        errorMessage = errorData.message || errorMessage;
        errorCode = errorData.code;
      } catch {
        // Ignore the parsing error and use the default values that have already been set.
      }

      throw {
        message: errorMessage,
        status: response.status,
        code: errorCode,
      } as CodeConnectError;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      console.warn("Code Connect creation request was aborted.");
      throw {
        message: "Petició cancel·lada.",
        code: "ABORTED",
      } as CodeConnectError;
    }

    if (error instanceof TypeError) {
      console.error("Network error while creating Code Connect:", error);
      throw {
        message: "Error de connexió. Verifica la teva connexió a internet.",
        code: "NETWORK_ERROR",
      } as CodeConnectError;
    }

    console.error("Error while creating Code Connect:", error);
    throw error;
  }
};

export const fetchCodeConnectProject = async (
  projectId: number,
): Promise<ApiProjectResponse> => {
  const url = `${API_URL}${END_POINTS.codeconnect.get}/${projectId}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;

      try {
        const errorData = (await response.json()) as { message?: string };
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Keep the default message when the backend does not return usable JSON.
      }

      throw {
        message: errorMessage,
        status: response.status,
        code: "FETCH_CODECONNECT_PROJECT_ERROR",
      } as CodeConnectError;
    }

    const data = (await response.json()) as ApiProjectResponse;

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      console.error(
        "Network error while fetching Code Connect project details:",
        error,
      );
      throw {
        message: "Error de connexió. Verifica la teva connexió a internet.",
        code: "NETWORK_ERROR",
      } as CodeConnectError;
    }

    console.error("Error while fetching Code Connect project details:", error);
    throw error;
  }
};

export const fetchCodeConnectAllProjects = async (
  signal?: AbortSignal,
): Promise<ApiProjectsResponse> => {
  const url = `${API_URL}${END_POINTS.codeconnect.get}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal,
    });

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      let errorCode: string | undefined;

      try {
        const errorData = (await response.json()) as {
          message?: string;
          code?: string;
        };

        errorMessage = errorData.message || errorMessage;
        errorCode = errorData.code;
      } catch {
        // Ignore the parsing error and use the default values that have already been set.
      }

      throw {
        message: errorMessage,
        status: response.status,
        code: errorCode,
      } as CodeConnectError;
    }

    return (await response.json()) as ApiProjectsResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw {
        message: "Petició cancel·lada.",
        code: "ABORTED",
      } as CodeConnectError;
    }

    if (error instanceof TypeError) {
      throw {
        message: "Error de connexió. Verifica la teva connexió a internet.",
        code: "NETWORK_ERROR",
      } as CodeConnectError;
    }

    throw error;
  }
};

  export const fetchProjectContributors = async (
    projectId: number,
     ): Promise<ApiContributor[]> => {
      const url = `${API_URL}${END_POINTS.codeconnect.get}/${projectId}/contributors`;
      try {
        const response = await fetch(url, {
          headers: { Accept: 'application/json' },
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
    status: 'accepted' | 'rejected',
  ): Promise<boolean> => {
    const token = localStorage.getItem('auth_token');
    const url = `${API_URL}${END_POINTS.codeconnect.get}/${projectId}/contributors/${contributorId}/status`;
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      return response.ok;
    } catch {
      return false;
    }
};

