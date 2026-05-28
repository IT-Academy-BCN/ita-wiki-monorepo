import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTicketComments } from "../useTicketComments";

const { mockGetComments } = vi.hoisted(() => ({
  mockGetComments: vi.fn(),
}));

vi.mock("../../api/endPointTickets", () => ({
  getComments: mockGetComments,
}));

describe("useTicketComments", () => {
  beforeEach(() => {
    mockGetComments.mockClear();
  });

  it("should fetch comments on mount", async () => {
    const mockComments = [{ id: 1, comment: "Test", user: { id: 1 } }];
    mockGetComments.mockResolvedValue(mockComments);

    const { result } = renderHook(() => useTicketComments(1));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.comments).toEqual(mockComments);
    expect(mockGetComments).toHaveBeenCalledWith(1);
  });
});
