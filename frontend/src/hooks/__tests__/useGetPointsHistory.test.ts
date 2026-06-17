import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchPointsHistory } from "../../api/endPointLeagues";
import type { PointsHistoryEntry } from "../../types/league";
import { useGetPointsHistory } from "../useGetPointsHistory";

vi.mock("../../api/endPointLeagues", () => ({
  fetchPointsHistory: vi.fn(),
}));

const mockHistory: PointsHistoryEntry[] = [
  {
    date: "2026-06-01T10:00:00.000000Z",
    points: 5,
    activity: "Resolució de Dubtes",
  },
  {
    date: "2026-06-05T10:00:00.000000Z",
    points: 10,
    activity: "Correcció de PR",
  },
  { date: "2026-06-10T10:00:00.000000Z", points: 20, activity: "Presentació" },
];

describe("useGetPointsHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns history when API call succeeds", async () => {
    vi.mocked(fetchPointsHistory).mockResolvedValueOnce(mockHistory);

    const { result } = renderHook(() => useGetPointsHistory());

    await waitFor(() => {
      expect(fetchPointsHistory).toHaveBeenCalledTimes(1);
      expect(result.current.history).toEqual(mockHistory);
    });
  });

  it("returns empty array when API call fails", async () => {
    vi.mocked(fetchPointsHistory).mockRejectedValueOnce(
      new Error("Network error"),
    );

    const { result } = renderHook(() => useGetPointsHistory());

    await waitFor(() => {
      expect(result.current.history).toEqual([]);
    });
  });
});
