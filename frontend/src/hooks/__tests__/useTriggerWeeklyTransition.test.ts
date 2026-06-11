import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useTriggerWeeklyTransition } from "../useTriggerWeeklyTransition";

describe("useTriggerWeeklyTransition", () => {
  it("should trigger weekly transition successfully", async () => {
    const mockTriggerWeeklyTransition = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useTriggerWeeklyTransition({
        triggerWeeklyTransition: mockTriggerWeeklyTransition,
      }),
    );

    await act(async () => {
      await result.current.trigger();
    });

    expect(mockTriggerWeeklyTransition).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});
