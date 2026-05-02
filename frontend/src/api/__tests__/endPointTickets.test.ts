import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTicket, fetchAllTickets } from "../endPointTickets";
import { IntCreateTicket } from "../../types/ticketingTypes";

vi.mock("../../config", () => ({
  API_URL: "http://localhost:3000",
  END_POINTS: {
    tickets: {
      get: "/api/tickets",
      post: "/api/tickets",
    },
  },
}));

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

describe("fetchAllTickets", () => {
  const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockClear();
  });

  it("should return the data correctly", async () => {
    const mockInnerData = [{ id: 1, name: "Bug login" }];
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockInnerData }),
    });

    const result = await fetchAllTickets();
    expect(result).toEqual(mockInnerData);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should make a console.error if the response is not OK", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
    });

    const result = await fetchAllTickets();
    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      new Error("Failed to fetch tickets"),
    );
  });

  it("should handle network errors", async () => {
    const networkError = new Error("Network Error");
    fetchMock.mockRejectedValue(networkError);

    await fetchAllTickets();
    expect(consoleSpy).toHaveBeenCalledWith(networkError);
  });
});
