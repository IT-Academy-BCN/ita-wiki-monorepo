import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("./components/Layout/HeaderComponent", () => ({ default: () => null }));
vi.mock("./components/Layout/AsideComponent", () => ({ default: () => null }));
vi.mock("./components/RequireAuth", () => ({ default: () => null }));
vi.mock("./context/UserContext", () => ({
  useUserContext: () => ({ user: null }),
}));
vi.mock("./pages/RankingsPage", () => ({
  default: () => <div data-testid="rankings-page" />,
}));

describe("App", () => {
  it("is defined", () => {
    expect(App).toBeDefined();
  });

  it("renders RankingsPage at /ligas", () => {
    render(
      <MemoryRouter initialEntries={["/ligas"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("rankings-page")).toBeInTheDocument();
  });
});
