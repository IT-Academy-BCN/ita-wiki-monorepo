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

  it("renders leave project button", () => {
    render(<ProjectTeam timeDuration="2 mesos" />);

    expect(
      screen.getByRole("button", { name: /Deixar projecte/i }),
    ).toBeInTheDocument();
  });

  it("opens the leave project modal and closes it with the cancel button", () => {
    render(<ProjectTeam timeDuration="2 mesos" />);
    const leaveProjectButton = screen.getByRole("button", {
      name: /Deixar projecte/i,
    });
    fireEvent.click(leaveProjectButton);
    expect(
      screen.getByRole("heading", { name: "Deixar projecte" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Segur que vols deixar aquest projecte?"),
    ).toBeInTheDocument();
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(
      screen.queryByRole("heading", { name: "Deixar projecte" }),
    ).not.toBeInTheDocument();
  });
});
