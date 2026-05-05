import { IntCreateTicket, IntTicket } from "../types/ticketingTypes";
import { API_URL, END_POINTS } from "../config";

export const ticketsEndpoint = `${API_URL}${END_POINTS.tickets.get}`;

export const createTicket = async (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _data: IntCreateTicket,
): Promise<IntTicket> => {
  throw new Error("Not implemented");
};
