import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { dismissLeagueNotification } from "../../api/endPointLeagues";
import { useLeagueNotification } from "../useLeagueNotification";

vi.mock("../../api/endPointLeagues", () => ({
  dismissLeagueNotification: vi.fn(),
}));

describe("useLeagueNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns notification data when API call succeeds", async () => {
    const mockData = { hasChange: true, direction: "up", newLeagueId: 2 } as const;
    vi.mocked(dismissLeagueNotification).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useLeagueNotification());

    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.notification).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });
  });
});
