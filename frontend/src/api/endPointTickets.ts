import axios from "axios";
import {
  IntCreateTicket,
  IntTicket,
  TicketComment,
} from "../types/ticketingTypes";

import { API_URL, END_POINTS } from "../config";

export const createTicket = async (
  data: IntCreateTicket,
): Promise<IntTicket> => {
  const token = localStorage.getItem("auth_token");
  const url = `${API_URL}${END_POINTS.tickets.post}`;

  const response = await axios.post<{ data: IntTicket }>(url, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const getComments = async (
  ticketId: number,
): Promise<TicketComment[]> => {
  const token = localStorage.getItem("auth_token");
  const url = `${API_URL}/api/tickets/${ticketId}/comments`;

  const response = await axios.get<{ data: TicketComment[] }>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

