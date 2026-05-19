import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import PendingRequests from "../PendingRequests";
import * as endPointContributors from "../../../../api/endPointContributors";
import type { ApiContributor } from "../../../../types/codeConnectTypes";

vi.mock("../../../../api/endPointContributors");

const mockFetch = vi.spyOn(endPointContributors, "fetchProjectContributors");

const pendingContributor: ApiContributor = {
  id: 1,
  user_id: 200,
  programming_role: "Frontend Developer",
  status: "pending",
  user: { id: 200, name: "Anna", email: "anna@test.com" },
};

beforeEach(() => {
  vi.clearAllMocks();
  mockFetch.mockResolvedValue([pendingContributor]);
});

describe("PendingRequests", () => {
  it("renders pending contributors for the owner", async () => {
    render(<PendingRequests projectId={1} ownerId={99} currentUserId={99} />);
    expect(await screen.findByText("[Anna]")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Acceptar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Rebutjar" }),
    ).toBeInTheDocument();
  });
});
