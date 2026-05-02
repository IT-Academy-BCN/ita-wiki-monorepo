import { IntCreateTicket, Ticket } from "../types/ticketingTypes";

const API_URL = import.meta.env.VITE_API_URL;

export const createTicket = async (data: IntCreateTicket): Promise<Ticket> => {
  try {
    const token = localStorage.getItem("auth_token");

    const response = await fetch(`${API_URL}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create ticket");
    }

    return result.data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Network error, please check your connection");
    }
    if (error instanceof DOMException) {
      throw new Error("Request was aborted");
    }
    throw error;
  }
};
