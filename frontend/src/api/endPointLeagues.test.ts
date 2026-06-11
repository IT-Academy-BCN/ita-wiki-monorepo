import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PointsHistoryEntry } from "../types/league";
import { fetchPointsHistory } from "./endPointLeagues";

const mockHistory: PointsHistoryEntry[] = [
  { date: "2026-06-01T10:00:00.000000Z", points: 5, activity: "Resolució de Dubtes" },
  { date: "2026-06-05T10:00:00.000000Z", points: 10, activity: "Correcció de PR" },
  { date: "2026-06-10T10:00:00.000000Z", points: 20, activity: "Presentació" },
];

describe("fetchPointsHistory", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    localStorage.setItem("auth_token", "test-token");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("returns history data when API responds successfully", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockHistory),
      } as Response),
    );

    const result = await fetchPointsHistory();

    expect(result).toEqual(mockHistory);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("ligas/history"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      }),
    );
  });

  it("returns empty array when API responds with no data", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response),
    );

    const result = await fetchPointsHistory();

    expect(result).toEqual([]);
  });

  it("throws error when API responds with HTTP error", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
      } as Response),
    );

    await expect(fetchPointsHistory()).rejects.toThrow(
      "Failed to fetch points history",
    );
  });

  it("throws error when fetch fails", async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error("Network error")),
    );

    await expect(fetchPointsHistory()).rejects.toThrow("Network error");
  });
});
