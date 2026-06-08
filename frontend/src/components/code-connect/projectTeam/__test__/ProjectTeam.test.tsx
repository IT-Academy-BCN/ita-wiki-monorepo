// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProjectTeam from "../ProjectTeam";

vi.mock("../../../../hooks/useProjectContributors", () => ({
  useProjectContributors: () => ({
    getTeamByRole: () => ({ members: [], emptySlots: 1 }),
  }),
}));

vi.mock("../../code-connect/projectCard/ProgressBar", () => ({
  default: () => <div>Barra</div>,
}));

vi.mock("../../../../utils/getCurrentUserId", () => ({
  getCurrentUserId: () => 7,
}));

describe("ProjectTeam Component", () => {
  it("renderitza els títols, la durada i les seccions", () => {
    render(<ProjectTeam timeDuration="2 mesos" />);
    expect(screen.getByText("Equip")).toBeTruthy();
    expect(screen.getByText("Frontend")).toBeTruthy();
    expect(screen.getByText("Backend")).toBeTruthy();
    expect(screen.getByText("2 mesos")).toBeTruthy();
  });

  it("should disable the button when no role is selected", () => {
    render(<ProjectTeam timeDuration="2 mesos" />);
    const button = screen.getByRole("button", { name: /apuntar-me/i });
    expect(button).toBeDisabled();
  });

  it("should enable the button when a frontend role is selected", () => {
    render(<ProjectTeam timeDuration="2 mesos" />);
    const button = screen.getByRole("button", { name: /apuntar-me/i });
    expect(button).toBeDisabled();
    const emptySlots = screen.getAllByRole("button", { name: /\+/i });
    fireEvent.click(emptySlots[0]);
    expect(button).not.toBeDisabled();
  });

  it("should render the leave project button when the current user is a contributor", () => {
    render(
      <ProjectTeam
        timeDuration="2 mesos"
        contributors={[
          {
            id: 12,
            user_id: 7,
            name: "Clara",
            programming_role: "Frontend Developer",
            avatar_url: null,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("button", { name: /deixar projecte/i }),
    ).toBeInTheDocument();
  });
});
