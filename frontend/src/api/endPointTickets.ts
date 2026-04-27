// src/api/endPointTickets.ts
import { API_URL, END_POINTS } from "../config";

export const fetchAllTickets = async () => {
  const url = `${API_URL}${END_POINTS.tickets.get}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch tickets");
    const data = await response.json();
    return Array.isArray(data) ? data : data.data;
  } catch (error: unknown) {
    console.error(error);
  }
};
