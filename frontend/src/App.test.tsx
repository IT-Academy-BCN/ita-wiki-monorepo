import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
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

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe("App", () => {
  it("is defined", () => {
    expect(App).toBeDefined();
  });

  it("renders RankingsPage at /ligas", () => {
    renderAt("/ligas");
    expect(screen.getByTestId("rankings-page")).toBeInTheDocument();
  });
});
