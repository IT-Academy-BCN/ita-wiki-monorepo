import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import PendingRequests from "../PendingRequests";
import * as endPointContributors from "../../../../api/endPointContributors";
import type { ApiContributor } from "../../../../types/codeConnectTypes";

vi.mock("../../../../api/endPointContributors");

const mockFetch = vi.spyOn(endPointContributors, "fetchProjectContributors");
const mockUpdate = vi.spyOn(endPointContributors, "updateContributorStatus");

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
  mockUpdate.mockResolvedValue(true);
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

  it("calls updateContributorStatus with accepted when clicking Acceptar", async () => {
    render(<PendingRequests projectId={1} ownerId={99} currentUserId={99} />);
    await screen.findByText("[Anna]");
    await userEvent.click(screen.getByRole("button", { name: "Acceptar" }));
    expect(mockUpdate).toHaveBeenCalledWith(1, 1, "accepted");
  });

  it("calls updateContributorStatus with rejected when clicking Rebutjar", async () => {
    render(<PendingRequests projectId={1} ownerId={99} currentUserId={99} />);
    await screen.findByText("[Anna]");
    await userEvent.click(screen.getByRole("button", { name: "Rebutjar" }));
    expect(mockUpdate).toHaveBeenCalledWith(1, 1, "rejected");
  });

  it("reloads contributors after a successful action", async () => {
    render(<PendingRequests projectId={1} ownerId={99} currentUserId={99} />);
    await screen.findByText("[Anna]");
    await userEvent.click(screen.getByRole("button", { name: "Acceptar" }));
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });
});
