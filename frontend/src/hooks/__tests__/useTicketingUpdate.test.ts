import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateTicket, updateTicketStatus } from "../../api/endPointTickets";
import { useTicketingUpdate } from "../useTicketingUpdate";

vi.mock("../../api/endPointTickets", () => ({
  updateTicket: vi.fn(),
  updateTicketStatus: vi.fn(),
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

    let response: boolean | undefined;

    await act(async () => {
      response = await result.current.updatePriority(1, "high");
    });

    expect(updateTicket).toHaveBeenCalledWith(1, {
      priority: "high",
    });

    expect(result.current.errorMessage).toBeNull();
    expect(response).toBe(true);
  });

  it("updates ticket status correctly", async () => {
    vi.mocked(updateTicketStatus).mockResolvedValue({
      id: 1,
      status: "closed",
    } as never);

    const { result } = renderHook(() => useTicketingUpdate());

    let response: boolean | undefined;

    await act(async () => {
      response = await result.current.updateStatus(1, "closed");
    });

    expect(updateTicketStatus).toHaveBeenCalledWith(1, "closed");

    expect(result.current.errorMessage).toBeNull();
    expect(response).toBe(true);
  });
});
