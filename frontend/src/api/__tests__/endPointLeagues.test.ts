import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LigaResponse } from "../../types/league";
import { fetchLeagueRanking } from "../endPointLeagues";

vi.mock("../../config", () => ({
  API_URL: "http://localhost:8000",
  END_POINTS: {
    leagues: {
      getWeekly: "/ligas",
    },
  },
}));

const fetchMock = vi.fn();

describe("fetchLeagueRanking", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("Should fetch the league rankings", async () => {
    const mockResponse: LigaResponse = {
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

    fetchMock.mockResolvedValueOnce({
      json: async () => mockResponse,
      ok: true,
    });

    const result = await fetchLeagueRanking();

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8000/ligas", {
      signal: undefined,
    });
    expect(result).toEqual(mockResponse);
  });
});
