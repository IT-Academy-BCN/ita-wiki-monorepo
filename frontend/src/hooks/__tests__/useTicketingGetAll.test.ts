import { act, renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type {
  ApiTicketData,
  ApiTicketsResponse,
} from "../../types/ticketingTypes";
import { useTicketingGetAll } from "../useTicketingGetAll";

const makeTicket = (overrides: Partial<ApiTicketData> = {}): ApiTicketData => {
  return {
    id: 1,
    code_connect_id: 10,
    forum_answer_id: null,
    name: "Error login",
    incident_date: "2026-04-27",
    affected_app: "wiki_frontend",
    type: "error",
    affected_function: "login",
    description: "No es pot iniciar sessió",
    status: "pending",
    priority: "medium",
    assignee_id: null,
    closed_by: null,
    closed_at: null,
    created_at: "2026-04-27T10:00:00.000000Z",
    updated_at: "2026-04-27T10:00:00.000000Z",
    code_connect: null,
    assignee: null,
    closed_by_user: null,
    ...overrides,
  };
};

const renderUseTicketingGetAllWithResponse = async (
  response: ApiTicketsResponse,
) => {
  vi.spyOn(axios, "get").mockResolvedValueOnce({
    data: response,
  });

  const renderedHook = renderHook(() => useTicketingGetAll());

  await waitFor(() => {
    expect(renderedHook.result.current.isLoading).toBe(false);
  });

  return renderedHook.result;
};

describe("useTicketingGetAll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue("fake-token");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("stores tickets when the API returns a successful response with data", async () => {
    const apiTickets: ApiTicketData[] = [
      makeTicket(),
      makeTicket({ id: 2, name: "Error recursos" }),
    ];

    const response: ApiTicketsResponse = {
      success: true,
      data: apiTickets,
    };

    const result = await renderUseTicketingGetAllWithResponse(response);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.tickets).toEqual(apiTickets);
  });

  it("stores an empty ticket list when the API returns a successful response without data", async () => {
    const response: ApiTicketsResponse = {
      success: true,
      data: [],
    };

    const result = await renderUseTicketingGetAllWithResponse(response);

    expect(result.current.errorMessage).toBeNull();
    expect(result.current.tickets).toEqual([]);
  });

  it("sets an error message when the API returns an unsuccessful response", async () => {
    const response: ApiTicketsResponse = {
      success: false,
      message: "Unauthorized",
      data: [],
    };

    const result = await renderUseTicketingGetAllWithResponse(response);

    expect(result.current.tickets).toEqual([]);
    expect(result.current.errorMessage).toBe("Unauthorized");
  });

  it("refetches tickets when refetch is called", async () => {
    const apiTickets: ApiTicketData[] = [makeTicket()];

    vi.spyOn(axios, "get")
      .mockResolvedValueOnce({ data: { success: true, data: [] } })
      .mockResolvedValueOnce({ data: { success: true, data: apiTickets } });

    const { result } = renderHook(() => useTicketingGetAll());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.tickets).toEqual([]);

    await act(async () => result.current.refetch());

    await waitFor(() => expect(result.current.tickets).toEqual(apiTickets));
    expect(axios.get).toHaveBeenCalledTimes(2);
  });

  it("requests suggestions when includeSuggestions is true", async () => {
    vi.spyOn(axios, "get").mockResolvedValueOnce({
      data: { success: true, data: [] },
    });

    renderHook(() => useTicketingGetAll(true));

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(axios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: { include_suggestions: true },
      }),
    );
  });
});
