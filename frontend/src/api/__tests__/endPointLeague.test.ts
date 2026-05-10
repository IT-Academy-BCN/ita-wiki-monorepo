import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { addLeaguePoints } from "../endPointLeague";

vi.mock("../../config", () => ({
  API_URL: "http://localhost:8000",
  END_POINTS: {
    leagues: {
      points: "/ligas",
    },
  },
}));

const fetchMock = vi.fn();

describe("addLeaguePoints", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("localStorage", {
      getItem: vi.fn().mockReturnValue("fake-token"),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("Should add league points", async () => {
    const mockResponse = {
      points: 5,
      user_id: 1,
    };

    fetchMock.mockResolvedValueOnce({
      json: async () => mockResponse,
      ok: true,
    });

    const result = await addLeaguePoints(1);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/ligas/1/points",
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer fake-token",
        },
      },
    );

    expect(result).toEqual(mockResponse);
  });

  it("Should throw an error when response is not ok", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
    });

    await expect(addLeaguePoints(1)).rejects.toThrow(
      "Error adding league points",
    );
  });
});
