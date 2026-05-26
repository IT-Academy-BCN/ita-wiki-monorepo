import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchGlobalRanking } from "../../../api/endPointLeagues";
import { useUserContext } from "../../../context/UserContext";
import { TypUserRole } from "../../../types";
import { GlobalRanking } from "../GlobalRanking/GlobalRanking";

vi.mock("../../../api/endPointLeagues", () => ({
  fetchGlobalRanking: vi.fn(),
}));

vi.mock("../LeagueList/LeagueList", () => ({
  LeagueList: ({
    standings,
  }: {
    standings: { username: string; points: number }[];
  }) => (
    <div>
      <div>Posició</div>
      {standings.map((standing) => (
        <div key={standing.username}>
          <span>{standing.username}</span>
          <span>{standing.points}</span>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../../context/UserContext");

const mockUserContext = (role: TypUserRole) => {
  vi.mocked(useUserContext).mockReturnValue({
    user: {
      id: 1,
      github_user_name: "test-user",
      github_id: 123,
      name: "Test User",
      email: "test@example.com",
      password: "",
      role: role,
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

const mockRanking = [
  {
    position: 1,
    user_id: 101,
    username: "Júlia",
    points: 94,
    points_weekly: 94,
    status: "Junior developer",
    language: "React",
    league_id: 1,
    created_at: "2026-04-24T00:00:00Z",
    updated_at: "2026-04-24T00:00:00Z",
  },
];

describe("GlobalRanking", () => {
  beforeEach(() => {
    mockUserContext("student");
  });
  it("renders the league list after fetch", async () => {
    vi.mocked(fetchGlobalRanking).mockResolvedValue(mockRanking);
    render(<GlobalRanking />);

    await waitFor(() => {
      expect(screen.getByText("Posició")).toBeInTheDocument();
    });

    expect(screen.getAllByText("Júlia")).toHaveLength(1);
    expect(screen.getByText("94")).toBeInTheDocument();
  });

  it("renders AddLeaguePoints for mentors", () => {
    mockUserContext("mentor");
    vi.mocked(fetchGlobalRanking).mockResolvedValue([]);

    render(<GlobalRanking />);

    expect(
      screen.getByRole("form", { name: /add league points/i }),
    ).toBeInTheDocument();
  });

  it("renders AddLeaguePoints with ranking users (for mentors)", async () => {
    mockUserContext("mentor");
    vi.mocked(fetchGlobalRanking).mockResolvedValue(mockRanking);

    render(<GlobalRanking />);

    expect(
      screen.getByRole("form", { name: /add league points/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByText("Júlia")).toHaveLength(2);
    });
  });

  it("refreshes the ranking after adding point", async () => {
    mockUserContext("mentor");
    const user = userEvent.setup();
    vi.mocked(fetchGlobalRanking).mockResolvedValue(mockRanking);
    render(<GlobalRanking />);
    const select = await screen.findByRole("combobox");
    const options = screen.getAllByRole("option");
    const button = screen.getByRole("button", {
      name: "RESOLUCIÓ DE DUBTES (5 pt)",
    });
    await user.selectOptions(select, options[1]);
    await user.click(button);
    expect(fetchGlobalRanking).toHaveBeenCalled();
  });

  it("renders without crashing on fetch error", () => {
    vi.mocked(fetchGlobalRanking).mockResolvedValue(new Error("fail"));
    expect(() => render(<GlobalRanking />)).not.toThrow();
  });
});
