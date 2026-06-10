import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProjectTeam from "../ProjectTeam";

vi.mock("../../../hooks/useProjectContributors", () => ({
  useProjectContributors: () => ({
    getTeamByRole: () => ({ members: [], emptySlots: 1 }),
  }),
}));

vi.mock("../../code-connect/projectCard/ProgressBar", () => ({
  default: () => <div>Barra</div>,
}));

vi.mock("../../../../context/UserContext", () => ({
  useUserContext: () => ({
    user: { id: 1 },
  }),
}));

describe("ProjectTeam - Pending state", () => {
  it("should show Pending and disable button when user has pending request", () => {
    const contributors = [
      {
        user_id: 1,
        status: "pending",
        programming_role: "Frontend Developer",
        user: {
          id: 1,
          name: "Test",
          email: "test@test.com",
        },
      },
    ];

    render(
      <ProjectTeam
        timeDuration="2 mesos"
        contributors={contributors}
        projectId={1}
      />,
    );

    const button = screen.getByRole("button", { name: /pending/i });

    expect(button).toBeDisabled();
  });
});
