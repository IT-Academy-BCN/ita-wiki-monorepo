import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as UserContext from "../../../context/UserContext";
import { LeagueList } from "../LeagueList/LeagueList";

export const createMockStandings = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    position: index + 1,
    user_id: 1 + index,
    username: `Júlia ${index > 0 ? index : ""}`,
    points: 94 - index * 2,
    points_weekly: 10 - index,
    status: "Junior developer",
    language: "React",
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  }));

const mockUserContext = (id: number) => {
  vi.spyOn(UserContext, "useUserContext").mockReturnValue({
    user: {
      id: id,
      github_user_name: "test-user",
      github_id: 123,
      name: "Test User",
      email: "test@example.com",
      password: "",
      role: "student",
    },
    isAuthenticated: true,
    setUser: vi.fn(),
    signOut: vi.fn(),
    signIn: vi.fn(),
    saveUser: vi.fn(),
    error: null,
    setError: vi.fn(),
    loading: false,
    setIsLoading: vi.fn(),
  });
};

describe("LeagueList", () => {
  beforeEach(() => {
    mockUserContext(8);
  });
  it("renders the column headers", () => {
    render(<LeagueList standings={createMockStandings(1)} />);

    expect(screen.getByText("Posició")).toBeInTheDocument();
    expect(screen.getByText("Nom")).toBeInTheDocument();
    expect(screen.getByText("Estatus")).toBeInTheDocument();
    expect(screen.getByText("Llenguatge")).toBeInTheDocument();
    expect(screen.getByText("Punts")).toBeInTheDocument();
  });

  it("renders all standings correctly", () => {
    render(<LeagueList standings={createMockStandings(1)} />);

    expect(screen.getByText("Júlia")).toBeInTheDocument();
    expect(screen.getByText("94")).toBeInTheDocument();
    expect(screen.getByTestId("league-position-1")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Junior developer")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("does not render participant positions when standings are empty", () => {
    render(<LeagueList standings={[]} />);

    expect(screen.queryByTestId("league-position-1")).not.toBeInTheDocument();
  });

  it("applies green background to the (ascending) top 3 when there are more than 3 participants", () => {
    render(<LeagueList standings={createMockStandings(4)} showUp />);
    expect(screen.getByTestId("league-position-1")).toHaveClass("bg-green-100");
    expect(screen.getByTestId("league-position-2")).toHaveClass("bg-green-100");
    expect(screen.getByTestId("league-position-3")).toHaveClass("bg-green-100");
    expect(screen.getByTestId("league-position-4")).not.toHaveClass(
      "bg-green-100",
    );
  });

  it("applies red background to the (descending) last 3 when there are more than 6 participants", () => {
    render(<LeagueList standings={createMockStandings(7)} showDown />);
    expect(screen.getByTestId("league-position-5")).toHaveClass("bg-red-100");
    expect(screen.getByTestId("league-position-6")).toHaveClass("bg-red-100");
    expect(screen.getByTestId("league-position-7")).toHaveClass("bg-red-100");
    expect(screen.getByTestId("league-position-4")).not.toHaveClass(
      "bg-red-100",
    );
  });

  it("displays an icon next to the logged user name", () => {
    render(<LeagueList standings={createMockStandings(8)} />);
    const loggedUserRow = screen.getByTestId("league-position-8");
    expect(loggedUserRow.querySelector("svg")).toBeInTheDocument();
  });
});
