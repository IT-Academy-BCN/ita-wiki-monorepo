import axios from "axios";
import {
  ApiUpdateTicketResponse,
  IntCreateTicket,
  IntTicket,
  IntUpdateTicket,
  ApiTicketData,
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

export const updateTicket = async (
  id: number,
  data: IntUpdateTicket,
): Promise<ApiTicketData> => {
  const token = localStorage.getItem("auth_token");
  const url = `${API_URL}${END_POINTS.tickets.patch}/${id}`;

  const response = await axios.patch<ApiUpdateTicketResponse>(url, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data; //ss
};
