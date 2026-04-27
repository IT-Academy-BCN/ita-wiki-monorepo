import { renderHook, waitFor } from "@testing-library/react";
import axios, {
  AxiosError,
  AxiosHeaders,
  CanceledError,
  type InternalAxiosRequestConfig,
} from "axios";
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

describe("useTicketingGetAll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue("fake-token");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns tickets when API success=true", async () => {
    const apiTickets: ApiTicketData[] = [
      makeTicket(),
      makeTicket({ id: 2, name: "Error recursos" }),
    ];

    const response: ApiTicketsResponse = {
      success: true,
      data: apiTickets,
    };

    vi.spyOn(axios, "get").mockResolvedValueOnce({
      data: response,
    });

    const { result } = renderHook(() => useTicketingGetAll());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.tickets).toEqual(apiTickets);
  });

  it("returns empty tickets when API success=true and data is empty", async () => {
    const response: ApiTicketsResponse = {
      success: true,
      data: [],
    };

    vi.spyOn(axios, "get").mockResolvedValueOnce({
      data: response,
    });

    const { result } = renderHook(() => useTicketingGetAll());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBeNull();
    expect(result.current.tickets).toEqual([]);
  });

  it("sets errorMessage when API success=false", async () => {
    const response: ApiTicketsResponse = {
      success: false,
      message: "Unauthorized",
      data: [],
    };

    vi.spyOn(axios, "get").mockResolvedValueOnce({
      data: response,
    });

    const { result } = renderHook(() => useTicketingGetAll());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tickets).toEqual([]);
    expect(result.current.errorMessage).toBe("Unauthorized");
  });

  it("sets errorMessage when API response shape is invalid", async () => {
    vi.spyOn(axios, "get").mockResolvedValueOnce({
      data: { nope: true },
    });

    const { result } = renderHook(() => useTicketingGetAll());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tickets).toEqual([]);
    expect(result.current.errorMessage).toBe("Invalid API response shape");
  });

  it("sets errorMessage on AxiosError with API message", async () => {
    const axiosRequestConfig: InternalAxiosRequestConfig = {
      headers: new AxiosHeaders(),
    };

    const axiosError = new AxiosError(
      "Request failed",
      "ERR_BAD_REQUEST",
      axiosRequestConfig,
      undefined,
      {
        data: {
          message: "Token invalid",
        },
        status: 401,
        statusText: "Unauthorized",
        headers: new AxiosHeaders(),
        config: axiosRequestConfig,
      },
    );

    vi.spyOn(axios, "get").mockRejectedValueOnce(axiosError);

    const { result } = renderHook(() => useTicketingGetAll());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tickets).toEqual([]);
    expect(result.current.errorMessage).toBe("Token invalid");
  });

  it("sets errorMessage on generic error", async () => {
    vi.spyOn(axios, "get").mockRejectedValueOnce(new Error("Network down"));

    const { result } = renderHook(() => useTicketingGetAll());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.tickets).toEqual([]);
    expect(result.current.errorMessage).toBe("Network down");
  });

  it("ignores cancelled request and does not set errorMessage", async () => {
    vi.spyOn(axios, "get").mockRejectedValueOnce(
      new CanceledError("Request cancelled"),
    );

    const { result } = renderHook(() => useTicketingGetAll());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBeNull();
    expect(result.current.tickets).toEqual([]);
  });
});
