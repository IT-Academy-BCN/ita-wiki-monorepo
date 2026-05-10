import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchGlobalRanking } from "../../api/endPointLeagues";
import type { LigaResponse } from "../../types/league";
import { useGlobalRanking } from "../useGlobalRanking";

vi.mock("../../api/endPointLeagues", () => ({
  fetchGlobalRanking: vi.fn(),
}));

const mockData: LigaResponse = [
  {
    position: 1,
    user_id: 101,
    points: 94,
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
  {
    position: 2,
    user_id: 102,
    points: 88,
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
  {
    position: 3,
    user_id: 103,
    points: 75,
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
];

describe("useGlobalRanking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns ranking when API success=true", async () => {
    vi.mocked(fetchGlobalRanking).mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useGlobalRanking());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchGlobalRanking).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
    expect(result.current.globalRanking).toEqual(mockData);
  });

  it("sets errorMessage in case of error", async () => {
    vi.mocked(fetchGlobalRanking).mockRejectedValueOnce(
      new Error("Network error"),
    );
    const { result } = renderHook(() => useGlobalRanking());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.error).toBe("Network error");
    expect(result.current.globalRanking).toHaveLength(0);
  });

  it("ignores AbortError and does not set errorMessage", async () => {
    const abortError = new DOMException("Aborted", "AbortError");
    vi.mocked(fetchGlobalRanking).mockRejectedValueOnce(abortError);
    const { result } = renderHook(() => useGlobalRanking());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.globalRanking).toEqual([]);
  });
});
