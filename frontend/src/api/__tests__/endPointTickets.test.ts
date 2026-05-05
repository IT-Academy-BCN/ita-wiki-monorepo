import { describe, expect, it, vi } from "vitest";

import { ticketsEndpoint } from "../endPointTickets";

vi.mock("../../config", () => ({
  API_URL: "http://localhost:3000",
  END_POINTS: {
    tickets: {
      get: "/api/tickets",
      post: "/api/tickets",
    },
  },
}));

describe("ticketsEndpoint", () => {
  it("should build the tickets endpoint correctly", () => {
    expect(ticketsEndpoint).toBe("http://localhost:3000/api/tickets");
  });
});
