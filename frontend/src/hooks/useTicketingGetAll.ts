import axios, { AxiosError, CanceledError } from "axios";
import { useEffect, useState } from "react";

import { API_URL } from "../config";

import type {
  ApiTicketsResponse,
  ApiTicketData,
  TicketingError,
} from "../types/ticketingTypes";

const isAbortLikeError = (value: unknown): boolean => {
  return value instanceof CanceledError;
};

export const useTicketingGetAll = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tickets, setTickets] = useState<ApiTicketData[]>([]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchTickets = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const token = localStorage.getItem("auth_token");

        const response = await axios.get<ApiTicketsResponse>(
          `${API_URL}tickets`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            signal: abortController.signal,
          },
        );

        const responseData = response.data;

        if (
          !responseData ||
          typeof responseData.success !== "boolean" ||
          !Array.isArray(responseData.data)
        ) {
          throw {
            message: "Invalid API response shape",
          } as TicketingError;
        }

        if (!responseData.success) {
          throw {
            message: responseData.message || "Invalid API response shape",
          } as TicketingError;
        }

        setTickets(responseData.data);
      } catch (error: unknown) {
        if (isAbortLikeError(error)) return;

        if (error instanceof AxiosError) {
          const responseData = error.response?.data as
            | Partial<TicketingError>
            | undefined;

          setErrorMessage(
            responseData?.message ||
              error.message ||
              "Error de connexió. Verifica la teva connexió a internet.",
          );

          return;
        }

        const message =
          error && typeof error === "object" && "message" in error
            ? String((error as { message: unknown }).message)
            : "Unknown error";

        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();

    return () => abortController.abort();
  }, []);

  return { tickets, isLoading, errorMessage };
};
