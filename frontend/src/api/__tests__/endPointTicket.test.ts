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
  });

  it("should make a POST request and return the created ticket", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockTicketResponse }),
    });

    const result = await createTicket(mockTicketData);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/tickets"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockTicketData),
      }),
    );

    expect(result).toEqual(mockTicketResponse);
  });

  it("should throw an error if response is not ok", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Validation error" }),
    });

    await expect(createTicket(mockTicketData)).rejects.toThrow(
      "Validation error",
    );
  });

  it("should throw default error message if no message in response", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await expect(createTicket(mockTicketData)).rejects.toThrow(
      "Failed to create ticket",
    );
  });
});
