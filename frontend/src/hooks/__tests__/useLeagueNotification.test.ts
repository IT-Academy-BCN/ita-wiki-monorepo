import { renderHook, waitFor, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchLeagueNotification } from "../../api/endPointLeagues";
import { useLeagueNotification } from "../useLeagueNotification";

vi.mock("../../api/endPointLeagues", () => ({
  fetchLeagueNotification: vi.fn(),
}));

describe("useLeagueNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns notification data when API call succeeds and not dismissed", async () => {
    const mockData = {
      hasChange: true,
      direction: "up",
      newLeagueId: 2,
      year: 2026,
      week_number: 25,
    } as const;
    vi.mocked(fetchLeagueNotification).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useLeagueNotification());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.notification).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });
  });

  it("returns hasChange false if it was already dismissed in localStorage", async () => {
    const mockData = {
      hasChange: true,
      direction: "up",
      newLeagueId: 2,
      year: 2026,
      week_number: 25,
    } as const;
    localStorage.setItem("league_notified_2026_25", "true");
    vi.mocked(fetchLeagueNotification).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useLeagueNotification());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.notification).toEqual({ hasChange: false });
    });
  });

  it("dismisses notification by setting localStorage and state", async () => {
    const mockData = {
      hasChange: true,
      direction: "up",
      newLeagueId: 2,
      year: 2026,
      week_number: 25,
    } as const;
    vi.mocked(fetchLeagueNotification).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useLeagueNotification());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.notification).toEqual({ hasChange: false });
    expect(localStorage.getItem("league_notified_2026_25")).toBe("true");
  });
});
