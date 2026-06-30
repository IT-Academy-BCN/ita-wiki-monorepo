import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import UserProvider from "../../../context/UserContext";
import type { LigaResponse } from "../../../types/league";
import { WeeklyRanking } from "../WeeklyRanking/WeeklyRanking";

const mockLeagues: LigaResponse = {
  "3": [
    {
      position: 1,
      user_id: 101,
      username: "Júlia",
      points_weekly: 94,
      status: "Junior Coder",
      language: "React",
      league_id: 3,
    },
  ],
};

describe("WeeklyRanking", () => {
  it("renders the standings table after fetch", async () => {
    render(
      <UserProvider>
        <WeeklyRanking leagues={mockLeagues} />
      </UserProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("Lliga Or")).toBeInTheDocument();
      expect(screen.getByText("Posició")).toBeInTheDocument();
    });
  });
});
