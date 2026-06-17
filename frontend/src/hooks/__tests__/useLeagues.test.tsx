import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchLeagueRanking } from "../../api/endPointLeagues";
import type { LigaResponse } from "../../types/league";
import { useLeagues } from "../useLeagues";

vi.mock("../../api/endPointLeagues", () => ({
  fetchLeagueRanking: vi.fn(),
}));

const mockData: LigaResponse = {
  "1": [
    {
      position: 1,
      user_id: 7,
      username: "ckoelpin",
      points_weekly: 99,
      league_id: 1,
    },
  ],
};

describe("useLeagues", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the ranking for each league", async () => {
    vi.mocked(fetchLeagueRanking).mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useLeagues());
    await waitFor(() => {
      expect(fetchLeagueRanking).toHaveBeenCalledTimes(1);
      expect(result.current.leagues).toEqual(mockData);
    });
  });

  it("refetches the ranking when fetchLeagues is called manually", async () => {
    vi.mocked(fetchLeagueRanking).mockResolvedValue(mockData);
    const { result } = renderHook(() => useLeagues());
    await waitFor(() => {
      expect(fetchLeagueRanking).toHaveBeenCalledTimes(1);
      expect(result.current.leagues).toEqual(mockData);
    });
    await act(async () => {
      await result.current.fetchLeagues();
    });
    expect(fetchLeagueRanking).toHaveBeenCalledTimes(2);
    expect(result.current.leagues).toEqual(mockData);
  });
});
