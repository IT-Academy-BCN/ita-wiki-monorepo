import { describe, expect, it, vi } from "vitest";
import {
  fetchProjectContributors,
  updateContributorStatus,
  joinProject,
} from "../endPointContributors";

vi.mock("../../config", () => ({
  API_URL: "http://localhost:8000",
  END_POINTS: { codeconnect: { get: "/codeconnect" } },
}));

describe("fetchProjectContributors", () => {
  it("should return contributors on success", async () => {
    const mockContributors = [
      {
        id: 1,
        user_id: 101,
        programming_role: "Frontend Developer",
        status: "pending",
        user: { id: 101, name: "Júlia", email: "julia@test.com" },
      },
    ];
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockContributors }),
    });
    expect(await fetchProjectContributors(1)).toEqual(mockContributors);
  });

  it("should return an empty array when response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false });
    expect(await fetchProjectContributors(1)).toEqual([]);
  });
});

describe("updateContributorStatus", () => {
  it("should return true on successful response", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: true });
    expect(await updateContributorStatus(1, 42, "accepted")).toBe(true);
  });

  it("should return false when response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false });
    expect(await updateContributorStatus(1, 42, "rejected")).toBe(false);
  });
});

describe("joinProject", () => {
  it("should return true on successful response", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: true });
    expect(await joinProject(1, "Frontend Developer")).toBe(true);
  });

  it("should return false when response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false });
    expect(await joinProject(1, "Backend Developer")).toBe(false);
  });
});
