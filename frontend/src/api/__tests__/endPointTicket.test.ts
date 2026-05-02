import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTicket } from "../endPointTickets";
import { IntCreateTicket } from "../../types/ticketingTypes";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

const mockTicketData: IntCreateTicket = {
  name: "Login no funciona",
  incident_date: "2026-04-30",
  affected_app: "wiki_frontend",
  type: "error",
  affected_function: "login",
  description: "No puc iniciar sessió.",
};

const mockTicketResponse = {
  ...mockTicketData,
  id: 1,
  code_connect_id: 42,
  status: "pending",
  priority: "medium",
  closed_by: null,
  closed_at: null,
  created_at: "2026-04-30T10:00:00Z",
  updated_at: "2026-04-30T10:00:00Z",
};

describe("createTicket", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("localStorage", {
      getItem: () => "fake-token",
    });
  });

  it("creates a ticket and returns the data", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockTicketResponse }),
    });

    const result = await createTicket(mockTicketData);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(result).toEqual(mockTicketResponse);
  });

  it("calls the correct endpoint", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockTicketResponse }),
    });

    await createTicket(mockTicketData);

    const calledUrl = fetchMock.mock.calls[0][0];
    expect(calledUrl).toContain("/tickets");
  });

  it("uses POST method", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockTicketResponse }),
    });

    await createTicket(mockTicketData);

    const calledOptions = fetchMock.mock.calls[0][1];
    expect(calledOptions.method).toBe("POST");
  });

  it("sends null token if user is not logged in", async () => {
    vi.stubGlobal("localStorage", {
      getItem: () => null,
    });

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockTicketResponse }),
    });

    await createTicket(mockTicketData);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("throws the error message from the server", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Validation error" }),
    });

    await expect(createTicket(mockTicketData)).rejects.toThrow(
      "Validation error",
    );
  });

  it("throws a default message if the server sends no message", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await expect(createTicket(mockTicketData)).rejects.toThrow(
      "Failed to create ticket",
    );
  });

  it("throws a network error if the connection fails", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(createTicket(mockTicketData)).rejects.toThrow(
      "Network error, please check your connection",
    );
  });

  it("throws an aborted error if the request is cancelled", async () => {
    fetchMock.mockRejectedValueOnce(new DOMException("Aborted"));

    await expect(createTicket(mockTicketData)).rejects.toThrow(
      "Request was aborted",
    );
  });
});
