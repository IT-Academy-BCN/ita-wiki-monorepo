import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { addLeaguePoints } from "../endPointLeague";

vi.mock("../../config", () => ({
  API_URL: "http://localhost:8000",
  END_POINTS: {
    leagues: {
      addPoints: "/ligas",
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

  it("Should throw an error when response is not ok", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
    });

    await expect(addLeaguePoints(1)).rejects.toThrow(
      "Error adding league points",
    );
  });
});
