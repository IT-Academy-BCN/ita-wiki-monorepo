import axios from "axios";
import {
  IntCreateTicket,
  IntTicket,
  TicketComment,
  ApiUpdateTicketResponse,
  IntUpdateTicket,
  ApiTicketData,
} from "../types/ticketingTypes";
import { API_URL, END_POINTS } from "../config";
import type { TicketStatus } from "../types/ticketingTypes";

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

export const updateTicketStatus = async (
  id: number,
  status: TicketStatus,
): Promise<ApiTicketData> => {
  const token = localStorage.getItem("auth_token");

  const url = `${API_URL}${END_POINTS.tickets.status(id)}`;

  const response = await axios.patch<ApiUpdateTicketResponse>(
    url,
    { status },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

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

  return response.data.data;
};

export const getComments = async (
  ticketId: number,
): Promise<TicketComment[]> => {
  const token = localStorage.getItem("auth_token");
  const url = `${API_URL}tickets/${ticketId}/comments`;

  const response = await axios.get<{ data: TicketComment[] }>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const addComment = async (
  ticketId: number,
  comment: string,
): Promise<TicketComment> => {
  const token = localStorage.getItem("auth_token");
  const url = `${API_URL}tickets/${ticketId}/comments`;

  const response = await axios.post<{ data: TicketComment }>(
    url,
    { comment },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const updateComment = async (
  ticketId: number,
  commentId: number,
  comment: string,
): Promise<TicketComment> => {
  const token = localStorage.getItem("auth_token");
  const url = `${API_URL}tickets/${ticketId}/comments/${commentId}`;

  const response = await axios.put<{ data: TicketComment }>(
    url,
    { comment },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};
