import { act, renderHook } from "@testing-library/react";
import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTicketingUpdatePriority } from "../useTicketingUpdate";

describe("useTicketingUpdatePriority", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue("fake-token");
  });

  it("updates ticket priority", async () => {
    vi.spyOn(axios, "patch").mockResolvedValueOnce({
      data: { success: true },
    });

    const { result } = renderHook(() => useTicketingUpdatePriority());

    await act(async () => {
      await result.current.updatePriority("1", "high");
    });

    expect(axios.patch).toHaveBeenCalledWith(
      expect.stringContaining("tickets/1/priority"),
      { priority: "high" },
      expect.any(Object),
    );
  });
});
