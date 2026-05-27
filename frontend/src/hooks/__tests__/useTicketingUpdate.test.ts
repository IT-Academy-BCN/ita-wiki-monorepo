import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateTicket } from "../../api/endPointTickets";
import { useTicketingUpdate } from "../useTicketingUpdate";

vi.mock("../../api/endPointTickets", () => ({
  updateTicket: vi.fn(),
}));

describe("useTicketingUpdate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates ticket status correctly", async () => {
    vi.mocked(updateTicket).mockResolvedValue({
      id: 1,
      status: "resolved",
    } as never);

    const { result } = renderHook(() => useTicketingUpdate());

    await act(async () => {
      await result.current.updateStatus(1, "resolved");
    });

    expect(updateTicket).toHaveBeenCalledWith(1, {
      status: "resolved",
    });

    expect(result.current.errorMessage).toBeNull();
  });
});
