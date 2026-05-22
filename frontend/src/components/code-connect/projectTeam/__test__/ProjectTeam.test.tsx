// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProjectTeam from "../ProjectTeam";

vi.mock("../../../../hooks/useProjectContributors", () => ({
  useProjectContributors: () => ({
    getTeamByRole: () => ({ members: [], emptySlots: 0 }),
  }),
}));

vi.mock("../../../atoms/ButtonComponent", () => ({
  default: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}));

vi.mock("../../projectCard/ProgressBar", () => ({
  default: () => <div>Barra</div>,
}));

vi.mock("../TeamRow", () => ({
  default: ({ onSlotClick }: { onSlotClick?: () => void }) => (
    <button onClick={onSlotClick}>+</button>
  ),
}));

vi.mock("../../../api/endPointJoinProject", () => ({
  joinProject: vi.fn(),
}));

describe("ProjectTeam Component", () => {
  it("renders titles, duration and sections", () => {
    render(<ProjectTeam projectId={1} timeDuration="2 mesos" />);
    expect(screen.getByText("Equip")).toBeTruthy();
    expect(screen.getByText("Frontend")).toBeTruthy();
    expect(screen.getByText("Backend")).toBeTruthy();
    expect(screen.getByText("2 mesos")).toBeTruthy();
  });

  it("the Apuntar-me button is disabled if no role is selected", () => {
    render(<ProjectTeam projectId={1} />);
    const button = screen.getByText("Apuntar-me");
    expect(button).toBeDisabled();
  });

  it("the Apuntar-me button is activated when selecting a role", () => {
    render(<ProjectTeam projectId={1} />);
    const slot = screen.getAllByText("+")[0];
    fireEvent.click(slot);
    const button = screen.getByText("Apuntar-me");
    expect(button).not.toBeDisabled();
  });
});
