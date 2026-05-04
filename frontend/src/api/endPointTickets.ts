import { IntCreateTicket, IntTicket } from "../types/ticketingTypes";
import { API_URL, END_POINTS } from "../config";

export const createTicket = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: IntCreateTicket,
): Promise<IntTicket> => {
  throw new Error("Not implemented");
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
