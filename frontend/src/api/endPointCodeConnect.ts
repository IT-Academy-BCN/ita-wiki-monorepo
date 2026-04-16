import { API_URL, END_POINTS } from "../config";
import type { IntCodeConnect } from "../types";
import type { ApiProjectResponse } from "../types/codeConnectTypes";

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
        // Ignorem errors de parseig i mantenim el missatge per defecte.
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
      console.warn("Petició cancel·lada per l'usuari o per timeout.");
      throw {
        message: "Petició cancel·lada.",
        code: "ABORTED",
      } as CodeConnectError;
    }

    if (error instanceof TypeError) {
      console.error("Error de xarxa en crear Code Connect:", error);
      throw {
        message: "Error de connexió. Verifica la teva connexió a internet.",
        code: "NETWORK_ERROR",
      } as CodeConnectError;
    }

    console.error("Error en crear Code Connect:", error);
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
        // Si el backend no envia JSON usable, mantenim el missatge per defecte.
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
        "Error de xarxa en obtenir el detall de Code Connect:",
        error,
      );
      throw {
        message: "Error de connexió. Verifica la teva connexió a internet.",
        code: "NETWORK_ERROR",
      } as CodeConnectError;
    }

    console.error("Error en obtenir el detall de Code Connect:", error);
    throw error;
  }
};
