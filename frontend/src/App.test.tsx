import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./components/Layout/HeaderComponent", () => ({ default: () => null }));
vi.mock("./components/Layout/AsideComponent", () => ({ default: () => null }));
vi.mock("./components/RequireAuth", () => ({ default: () => null }));
vi.mock("./context/UserContext", () => ({
  useUserContext: () => ({ user: null }),
}));

vi.mock("./pages/LeaguesPage", () => ({
  default: () => <div data-testid="leagues-page" />,
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

  it("renders LeaguesPage at /ligas", () => {
    renderAt("/ligas");
    expect(screen.getByTestId("leagues-page")).toBeInTheDocument();
  });
});
