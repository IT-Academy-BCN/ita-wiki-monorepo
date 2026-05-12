import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAddLeaguePoints } from "../useAddLeaguePoints";

describe("useAddLeaguePoints Hook", () => {
  it("Should add league points", async () => {
    const addLeaguePointsMock = vi.fn().mockResolvedValue({
      points: 15,
      user_id: 1,
    });

    const { result } = renderHook(() =>
      useAddLeaguePoints({
        addLeaguePoints: addLeaguePointsMock,
      }),
    );

    await act(async () => {
      await result.current.addPoints(1);
    });

    expect(addLeaguePointsMock).toHaveBeenCalledWith(1);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});
