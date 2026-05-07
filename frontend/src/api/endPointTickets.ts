import { IntCreateTicket, IntTicket } from "../types/ticketingTypes";
import { API_URL, END_POINTS } from "../config";

export const createTicket = async (
  data: IntCreateTicket,
): Promise<IntTicket> => {
  const url = `${API_URL}${END_POINTS.tickets.post}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create ticket");
  }

  const result = await response.json();
  return result.data;
};

export const fetchAllTickets = async () => {
  const url = `${API_URL}${END_POINTS.tickets.get}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch tickets");
    const data = await response.json();
    return data.data;
  } catch (error: unknown) {
    console.error(error);
  }
};
