import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("./components/Layout/HeaderComponent", () => ({
  default: () => <div data-testid="header" />,
}));

vi.mock("./components/Layout/AsideComponent", () => ({
  default: () => <div data-testid="aside" />,
}));

vi.mock("./components/RequireAuth", () => ({
  default: () => null,
}));

vi.mock("./context/UserContext", () => ({
  useUserContext: () => ({ user: null }),
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe("App", () => {
  it("App is defined", () => {
    expect(App).toBeDefined();
  });
});

describe("App routes", () => {
  it("renders RankingsPage at /ligas", () => {
    renderAt("/ligas");
    expect(screen.getByText("En construcció...")).toBeTruthy();
  });
});
