import { describe, it, expect, vi, beforeEach } from "vitest";
import { changeRole } from "../endPointChangeRole";

const mockSuccessResponse = {
  message: "Role updated successfully",
  role: {
    github_id: 123456,
    role: "mentor",
  },
};

describe("changeRole", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("sends PUT request with Authorization header from localStorage", async () => {
    localStorage.setItem("auth_token", "mock-token-abc");

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    } as Response);

    await changeRole({ github_id: 123456, role: "mentor" });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("feature-flags/role-self-assignment"),
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer mock-token-abc",
        }),
      }),
    );
  });

  it("sends PUT request without Authorization header when no token in localStorage", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    } as Response);

    await changeRole({ github_id: 123456, role: "mentor" });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("feature-flags/role-self-assignment"),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.anything(),
        }),
      }),
    );
  });

  it("returns role data on successful response", async () => {
    localStorage.setItem("auth_token", "mock-token-abc");

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    } as Response);

    const result = await changeRole({ github_id: 123456, role: "mentor" });

    expect(result).toEqual(mockSuccessResponse);
  });

  it("throws error when response is not ok", async () => {
    localStorage.setItem("auth_token", "mock-token-abc");

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({ message: "Unauthenticated." }),
    } as Response);

    await expect(
      changeRole({ github_id: 123456, role: "mentor" }),
    ).rejects.toThrow("Unauthenticated.");
  });

  it("throws error when response has unexpected shape", async () => {
    localStorage.setItem("auth_token", "mock-token-abc");

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ unexpected: "data" }),
    } as Response);

    await expect(
      changeRole({ github_id: 123456, role: "mentor" }),
    ).rejects.toThrow("Unexpected response from API.");
  });
});
