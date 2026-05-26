import axios, { AxiosError } from "axios";
import { useState } from "react";
import { API_URL } from "../config";
import type { TicketPriority } from "../types/ticketingTypes";

export const useTicketingUpdatePriority = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const updatePriority = async (
    ticketId: string,
    priority: TicketPriority,
  ): Promise<boolean> => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const token = localStorage.getItem("auth_token");

      await axios.patch(
        `${API_URL}tickets/${ticketId}/priority`,
        { priority },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return true;
    } catch (error) {
        setErrorMessage(error instanceof AxiosError? error.response?.data?.message || error.message: "Unknown error",);
        return false;
    } finally {
      setIsLoading(false);
    }
  };
  return { updatePriority, isLoading, errorMessage };
};