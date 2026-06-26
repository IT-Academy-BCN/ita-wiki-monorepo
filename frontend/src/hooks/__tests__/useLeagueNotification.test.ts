import { renderHook, waitFor, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchLeagueNotification } from "../../api/endPointLeagues";
import { useLeagueNotification } from "../useLeagueNotification";

vi.mock("../../api/endPointLeagues", () => ({
  fetchLeagueNotification: vi.fn(),
}));

const mockNotification = {
  hasChange: true,
  direction: "up",
  leagueName: "Silver",
  year: 2026,
  week_number: 25,
} as const;

describe("useLeagueNotification", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it("returns notification data when API call succeeds", async () => {
    vi.mocked(fetchLeagueNotification).mockResolvedValueOnce(mockNotification);

    const { result } = renderHook(() => useLeagueNotification());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.notification).toEqual(mockNotification);
      expect(result.current.error).toBeNull();
    });
  });

  it("clears notification state when dismiss is called", async () => {
    vi.mocked(fetchLeagueNotification).mockResolvedValueOnce(mockNotification);

    const { result } = renderHook(() => useLeagueNotification());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.dismiss());

    expect(result.current.notification).toEqual({ hasChange: false });
  });
});
