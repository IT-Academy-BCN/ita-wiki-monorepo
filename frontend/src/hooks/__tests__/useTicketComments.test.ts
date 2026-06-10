import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useTicketComments } from "../useTicketComments";

const { mockGetComments, mockAddComment, mockUpdateComment } = vi.hoisted(
  () => ({
    mockGetComments: vi.fn(),
    mockAddComment: vi.fn(),
    mockUpdateComment: vi.fn(),
  }),
);

vi.mock("../../api/endPointTickets", () => ({
  getComments: mockGetComments,
  addComment: mockAddComment,
  updateComment: mockUpdateComment,
}));

describe("useTicketComments", () => {
  beforeEach(() => {
    mockGetComments.mockClear();
    mockAddComment.mockClear();
    mockUpdateComment.mockClear();
  });

  it("should fetch comments on mount", async () => {
    const mockComments = [{ id: 1, comment: "Test", user: { id: 1 } }];
    mockGetComments.mockResolvedValue(mockComments);

    const { result } = renderHook(() => useTicketComments(1));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.comments).toEqual(mockComments);
    expect(mockGetComments).toHaveBeenCalledWith(1);
  });

  it("should call addComment with ticketId and comment text", async () => {
    mockGetComments.mockResolvedValue([]);
    mockAddComment.mockResolvedValue(undefined);

    const { result } = renderHook(() => useTicketComments(1));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await result.current.submitComment("Hello");
    expect(mockAddComment).toHaveBeenCalledWith(1, "Hello");
  });

  it("should update comment in local state after editComment", async () => {
    const original = { id: 1, comment: "old text", user_id: 1 };
    const updated = { id: 1, comment: "new text", user_id: 1 };
    mockGetComments.mockResolvedValue([original]);
    mockUpdateComment.mockResolvedValue(updated);

    const { result } = renderHook(() => useTicketComments(1));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await result.current.editComment(1, "new text");

    await waitFor(() =>
      expect(result.current.comments[0].comment).toBe("new text"),
    );
  });
});
