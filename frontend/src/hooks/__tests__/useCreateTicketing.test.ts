import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCreateTicketing } from "../useCreateTicketing";
import { IntCreateTicket, IntTicket } from "../../types/ticketingTypes";

const { mockCreateTicket } = vi.hoisted(() => ({
  mockCreateTicket: vi.fn(),
}));

vi.mock("../../api/endPointTickets", () => ({
  createTicket: mockCreateTicket,
}));

const mockTicketData: IntCreateTicket = {
  name: "Login fails on mobile",
  incident_date: "2026-04-29",
  affected_app: "wiki_frontend",
  type: "error",
  affected_function: "login",
  description: "The login button does not respond on mobile devices.",
};

const mockTicketResponse: IntTicket = {
  ...mockTicketData,
  id: 1,
  code_connect_id: 42,
  status: "pending",
  priority: "medium",
  closed_by: null,
  closed_at: null,
  created_at: "2026-04-29T10:00:00Z",
  updated_at: "2026-04-29T10:00:00Z",
};

describe("useCreateTicketing", () => {
  beforeEach(() => {
    mockCreateTicket.mockClear();
  });

  it("should initialize with empty state and resolve successfully", async () => {
    mockCreateTicket.mockResolvedValue(mockTicketResponse);
    const { result } = renderHook(() => useCreateTicketing());

    expect(result.current.ticketing).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);

    let returned: IntTicket | null = null;
    await act(async () => {
      returned = await result.current.submitTicketing(mockTicketData);
    });

    expect(mockCreateTicket).toHaveBeenCalledWith(mockTicketData);
    expect(result.current.ticketing).toEqual(mockTicketResponse);
    expect(returned).toEqual(mockTicketResponse);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("should set isLoading to true during the request", async () => {
    let resolvePromise!: (value: IntTicket) => void;
    mockCreateTicket.mockImplementation(
      () => new Promise((res) => { resolvePromise = res; }),
    );

    const { result } = renderHook(() => useCreateTicketing());

    act(() => {
      result.current.submitTicketing(mockTicketData);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePromise(mockTicketResponse);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("should set error on failure and reset it on next success", async () => {
    mockCreateTicket.mockRejectedValueOnce(new Error("Error 500: Internal Server Error"));
    const { result } = renderHook(() => useCreateTicketing());

    void result.current.submitTicketing(mockTicketData);

    await waitFor(() => {
      expect(result.current.error?.message).toBe("Error 500: Internal Server Error");
    });

    expect(result.current.ticketing).toBeNull();
    expect(result.current.isLoading).toBe(false);

    mockCreateTicket.mockResolvedValueOnce(mockTicketResponse);

    await act(async () => {
      await result.current.submitTicketing(mockTicketData);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.ticketing).toEqual(mockTicketResponse);
  });
});
