import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { createTicket, addComment } from "../endPointTickets";
import { IntCreateTicket } from "../../types/ticketingTypes";

vi.mock("axios");
vi.mock("../../config", () => ({
  API_URL: "http://localhost:3000",
  END_POINTS: {
    tickets: {
      get: "/api/tickets",
      post: "/api/tickets",
    },
  },
}));

const mockPayload: IntCreateTicket = {
  name: "Test ticket",
  description: "Bug login",
  incident_date: "2026-05-08",
  type: "error",
};

describe("createTicket", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a ticket and return data", async () => {
    const mockTicket = { id: 1, description: "Bug login" };
    vi.mocked(axios.post).mockResolvedValue({ data: { data: mockTicket } });

    const result = await createTicket(mockPayload);

    expect(result).toEqual(mockTicket);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it("should include Authorization header", async () => {
    localStorage.setItem("auth_token", "test-token");
    vi.mocked(axios.post).mockResolvedValue({ data: { data: {} } });

    await createTicket(mockPayload);

    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      }),
    );
  });
});

describe("addComment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add a comment and return data", async () => {
    const mockComment = { id: 1, comment: "New comment", user: { id: 1 } };
    vi.mocked(axios.post).mockResolvedValue({ data: { data: mockComment } });

    const result = await addComment(1, "New comment");

    expect(result).toEqual(mockComment);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
});
