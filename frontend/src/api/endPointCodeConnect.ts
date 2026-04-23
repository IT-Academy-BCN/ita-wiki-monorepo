import { API_URL, END_POINTS } from "../config";
import { IntCodeConnect } from "../types";
import { ApiProjectsResponse } from "../types/codeConnectTypes";

export type CodeConnectError = {
  message: string;
  status?: number;
  code?: string;
};

export const createCodeConnect = async (
  formData: IntCodeConnect,
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
      let errorCode;

      try {
        const errorData = await response.json();
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
      console.warn("Petición cancelada por el usuario o timeout.");
      throw {
        message: "Petició cancel·lada",
        code: "ABORTED",
      } as CodeConnectError;
    }

    if (error instanceof TypeError) {
      console.error("Error de red al crear Code Connect:", error);
      throw {
        message: "Error de conexión. Verifica tu conexión a internet.",
        code: "NETWORK_ERROR",
      } as CodeConnectError;
    }

    console.error("Error al crear Code Connect:", error);
    throw error;
  }
};

export const fetchCodeConnectProject = async (projectId: number) => {
  const url = `${API_URL}${END_POINTS.codeconnect.get}/${projectId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch code connect project");
    }
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    console.error(error);
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
        // ignore
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
        message: "Petició cancel·lada",
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
