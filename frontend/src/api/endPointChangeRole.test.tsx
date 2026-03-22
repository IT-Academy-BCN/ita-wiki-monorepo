import { describe, it, expect, vi, beforeEach } from "vitest";
import { changeRole } from "./endPointChangeRole";

const mockSuccessResponse = {
  message: "Role updated successfully",
  role: {
    github_id: 123,
    role: "admin",
  },
};

describe("changeRole", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("should update role successfully", async () => {
    localStorage.setItem("auth_token", "mock-token");

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockSuccessResponse,
    } as Response);

    const response = await changeRole({ github_id: 123, role: "admin" });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("feature-flags/role-self-assignment"),
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          Authorization: "Bearer mock-token",
        }),
      }),
    );
    expect(response).toEqual(mockSuccessResponse);
  });

  it("should throw error when request fails", async () => {
    localStorage.setItem("auth_token", "mock-token");

    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({ message: "Unauthenticated." }),
    } as Response);

    await expect(changeRole({ github_id: 123, role: "admin" })).rejects.toThrow(
      "Unauthenticated.",
    );
  });
});
