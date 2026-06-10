import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import LeaguesPage from "../LeaguesPage";

vi.mock("../../components/leagues-ranking/WeeklyRanking/WeeklyRanking", () => ({
  WeeklyRanking: () => <h1>Lliga setmanal</h1>,
}));

vi.mock("../../components/leagues-ranking/GlobalRanking/GlobalRanking", () => ({
  GlobalRanking: () => <h1>Classificació general</h1>,
}));

const mockUseUser = vi.fn();
vi.mock("../../hooks/useUser", () => ({
  useUser: () => mockUseUser(),
}));
vi.mock("../../components/ui/Modal/GenericModal", () => ({
  default: ({
    isOpen,
    secondaryButtonAction,
    secondaryButtonText,
  }: {
    isOpen: boolean;
    secondaryButtonAction?: () => void;
    secondaryButtonText?: string;
  }) =>
    isOpen ? (
      <div role="dialog">
        <button onClick={secondaryButtonAction}>{secondaryButtonText}</button>
      </div>
    ) : null,
}));

describe("LeaguesPage", () => {
  it("shows WeeklyRanking by default", () => {
    mockUseUser.mockReturnValue({ user: null });
    render(<LeaguesPage />);

    expect(
      screen.getByRole("heading", { name: /lliga setmanal/i }),
    ).toBeInTheDocument();
  });

  it("switches to GlobalRanking on toggle", () => {
    mockUseUser.mockReturnValue({ user: null });
    render(<LeaguesPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /classificació general/i }),
    );

    expect(
      screen.getByRole("button", { name: /classificació general/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("switches back to WeeklyRanking on toggle from Global", () => {
    mockUseUser.mockReturnValue({ user: null });
    render(<LeaguesPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /classificació general/i }),
    );

    fireEvent.click(screen.getByRole("button", { name: /lliga setmanal/i }));

    expect(
      screen.getByRole("heading", { name: /lliga setmanal/i }),
    ).toBeInTheDocument();
  });

  it("shows trigger button for admin users", () => {
    mockUseUser.mockReturnValue({ user: { role: "admin" } });
    render(<LeaguesPage />);
    expect(
      screen.getByAltText("Trigger weekly transition"),
    ).toBeInTheDocument();
  });

  it("does not show trigger button for student users", () => {
    mockUseUser.mockReturnValue({ user: { role: "student" } });
    render(<LeaguesPage />);
    expect(
      screen.queryByAltText("Trigger weekly transition"),
    ).not.toBeInTheDocument();
  });
  
  it("opens modal when trigger button is clicked", () => {
    mockUseUser.mockReturnValue({ user: { role: "admin" } });
    render(<LeaguesPage />);
    fireEvent.click(screen.getByRole("button", { name: /trigger weekly transition/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes modal when cancel button is clicked", () => {
    mockUseUser.mockReturnValue({ user: { role: "admin" } });
    render(<LeaguesPage />);
    fireEvent.click(screen.getByRole("button", { name: /trigger weekly transition/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel·lar/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
