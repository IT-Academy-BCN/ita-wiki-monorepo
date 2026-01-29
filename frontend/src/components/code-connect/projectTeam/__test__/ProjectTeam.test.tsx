// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProjectTeam from "../ProjectTeam";

vi.mock("../../../../hooks/useProjectContributors", () => ({
  useProjectContributors: () => ({
    getTeamByRole: () => ({ members: [], emptySlots: 0 })
  })
}));

vi.mock("../../atoms/ButtonComponent", () => ({ default: () => <button>Botó</button> }));
vi.mock("../../code-connect/projectCard/ProgressBar", () => ({ default: () => <div>Barra</div> }));
vi.mock("../TeamRow", () => ({ default: () => <div>Fila TeamRow</div> }));

describe("ProjectTeam Component", () => {
  it("renderitza els títols, la durada i les seccions", () => {
    render(<ProjectTeam timeDuration="2 mesos" />);

    expect(screen.getByText("Equip")).toBeTruthy();
    expect(screen.getByText("Frontend")).toBeTruthy();
    expect(screen.getByText("Backend")).toBeTruthy();

    expect(screen.getByText("2 mesos")).toBeTruthy();

    expect(screen.getAllByText("Fila TeamRow")).toHaveLength(2);
  });
});