import { IntCreateTicket, IntTicket } from "../types/ticketingTypes";

const API_URL = import.meta.env.VITE_API_URL;

export const createTicket = async (
  data: IntCreateTicket,
): Promise<IntTicket> => {
  const response = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create ticket");
  }

  return result.data;
};
