// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PendingRequestList from "../PendingRequestList";
import * as endPointContributors from "../../../../api/endPointContributors";
import type { ApiContributor } from "../../../../types/codeConnectTypes";

vi.mock("../../../../api/endPointContributors");

vi.mock("../PendingRequest", () => ({ default: () => null }));

const pendingContributor: ApiContributor = {
  id: 1,
  user_id: 200,
  programming_role: "Frontend Developer",
  status: "pending",
  user: { id: 200, name: "Anna", email: "anna@test.com" },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PendingRequestList", () => {
  it("does not render when there are no pending requests", async () => {
    vi.spyOn(
      endPointContributors,
      "fetchProjectContributors",
    ).mockResolvedValue([]);

    const { container } = render(<PendingRequestList projectId={1} />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it("renders the section when there are pending requests", async () => {
    vi.spyOn(
      endPointContributors,
      "fetchProjectContributors",
    ).mockResolvedValue([pendingContributor]);

    render(<PendingRequestList projectId={1} />);

    expect(await screen.findByText("Peticions de col·laboració:")).toBeTruthy();
  });
});
