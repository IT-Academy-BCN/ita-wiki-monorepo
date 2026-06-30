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

vi.mock("../../hooks/useLeagues", () => ({
  useLeagues: () => ({
    leagues: null,
    fetchLeagues: vi.fn(),
  }),
}));

vi.mock("../../hooks/useTriggerWeeklyTransition", () => ({
  useTriggerWeeklyTransition: () => ({
    trigger: vi.fn(),
  }),
}));

const mockUseLeagueNotification = vi.fn(() => ({
  notification: null,
  dismiss: vi.fn(),
}));
vi.mock("../../hooks/useLeagueNotification", () => ({
  useLeagueNotification: () => mockUseLeagueNotification(),
}));

vi.mock("../../components/ui/Modal/GenericModal", () => ({
  default: ({
    isOpen,
    title,
    onClose,
    secondaryButtonAction,
    secondaryButtonText,
  }: {
    isOpen: boolean;
    title?: string;
    onClose?: () => void;
    secondaryButtonAction?: () => void;
    secondaryButtonText?: string;
  }) =>
    isOpen ? (
      <div role="dialog">
        {title && <p>{title}</p>}
        <button onClick={onClose}>Tancar</button>
        {secondaryButtonText && (
          <button onClick={secondaryButtonAction}>{secondaryButtonText}</button>
        )}
      </div>
    ) : null,
}));
vi.mock("../../components/ui/shared-ui/UiButton", () => ({
  default: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => <button onClick={onClick}>{children}</button>,
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
    fireEvent.click(
      screen.getByRole("button", { name: /trigger weekly transition/i }),
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes modal when cancel button is clicked", () => {
    mockUseUser.mockReturnValue({ user: { role: "admin" } });
    render(<LeaguesPage />);
    fireEvent.click(
      screen.getByRole("button", { name: /trigger weekly transition/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /cancel·lar/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens modal when clicking 'Veure el meu historial'", () => {
    mockUseUser.mockReturnValue({ user: null });
    render(<LeaguesPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /veure el meu historial/i }),
    );

    expect(screen.getByText(/el meu historial de punts/i)).toBeInTheDocument();
  });

  it("closes modal when clicking close button", () => {
    mockUseUser.mockReturnValue({ user: null });
    render(<LeaguesPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /veure el meu historial/i }),
    );

    fireEvent.click(screen.getByRole("button", { name: /tancar/i }));

    expect(
      screen.queryByText(/el meu historial de punts/i),
    ).not.toBeInTheDocument();
  });

  it("renders LeagueNotificationModal when there is a league change", () => {
    mockUseUser.mockReturnValue({ user: null });
    mockUseLeagueNotification.mockReturnValue({
      notification: {
        hasChange: true,
        direction: "up",
        leagueName: "Silver",
      },
      dismiss: vi.fn(),
    });

    render(<LeaguesPage />);

    expect(screen.getByText("Felicitats!")).toBeInTheDocument();
    expect(screen.getByText(/Has pujat a la lliga/)).toBeInTheDocument();
    expect(screen.getByText("Silver")).toBeInTheDocument();
  });

  it("calls dismiss when modal is closed", () => {
    mockUseUser.mockReturnValue({ user: null });
    const dismissSpy = vi.fn();
    mockUseLeagueNotification.mockReturnValue({
      notification: {
        hasChange: true,
        direction: "up",
        leagueName: "Silver",
      },
      dismiss: dismissSpy,
    });

    render(<LeaguesPage />);

    fireEvent.click(screen.getByRole("button", { name: "D'acord" }));

    expect(dismissSpy).toHaveBeenCalledTimes(1);
  });
});
