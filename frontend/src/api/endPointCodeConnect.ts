import { API_URL, END_POINTS } from "../config";
import { IntCodeConnect } from "../types";
import type {
  CodeConnectError,
  CodeConnectProjectDetailsResponse,
  CodeConnectProjectsResponse,
} from "../types/CodeConnectProjectTypes";

export const createCodeConnect = async (
  formData: IntCodeConnect,
  signal?: AbortSignal,
): Promise<unknown> => {
  const url = `${API_URL}${END_POINTS.codeconnect.post}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        // ignore
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

export const fetchCodeConnectAllProjects = async (
  signal?: AbortSignal,
): Promise<CodeConnectProjectsResponse> => {
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

    return (await response.json()) as CodeConnectProjectsResponse;
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

export const fetchCodeConnectProjectDetails = async (
  projectId: number,
  signal?: AbortSignal,
): Promise<CodeConnectProjectDetailsResponse> => {
  const url = `${API_URL}${END_POINTS.codeconnect.get}/${projectId}`;

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

    return (await response.json()) as CodeConnectProjectDetailsResponse;
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
