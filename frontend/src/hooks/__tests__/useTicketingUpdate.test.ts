import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTicketingUpdate } from "../useTicketingUpdate";
import { updateTicket } from "../../api/endPointTickets";

vi.mock("../../api/endPointTickets", () => ({
  updateTicket: vi.fn(),
}));

describe("useTicketingUpdate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates ticket priority correctly", async () => {
    vi.mocked(updateTicket).mockResolvedValue({
      id: 1,
      priority: "high",
    } as never);

    const { result } = renderHook(() => useTicketingUpdate());

    await act(async () => {
      await result.current.updatePriority(1, "high");
    });

    expect(updateTicket).toHaveBeenCalledWith(1, {
      priority: "high",
    });

    expect(result.current.errorMessage).toBeNull();
  });
});
