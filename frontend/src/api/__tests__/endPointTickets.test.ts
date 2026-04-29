import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchAllTickets } from "../endPointTickets";

vi.mock("../../config", () => ({
  API_URL: "http://localhost:3000",
  END_POINTS: {
    tickets: {
      get: "/api/tickets",
      post: "/api/tickets",
    },
  },
}));

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

describe("fetchAllTickets", () => {
  const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockClear();
  });

  it("should return the data correctly", async () => {
    const mockInnerData = [{ id: 1, name: "Bug login" }];
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockInnerData }),
    });

    const result = await fetchAllTickets();
    expect(result).toEqual(mockInnerData);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("should make a console.error if the response is not OK", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
    });

    const result = await fetchAllTickets();
    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(new Error("Failed to fetch tickets"));
  });

  it("should handle network errors (fetch throw)", async () => {
    const networkError = new Error("Network Error");
    fetchMock.mockRejectedValue(networkError);

    await fetchAllTickets();
    expect(consoleSpy).toHaveBeenCalledWith(networkError);
  });
});
