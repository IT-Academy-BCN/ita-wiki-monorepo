import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { vi } from "vitest";
import UserProvider from "../../context/UserContext";
import CodeConnectPage from "../CodeConnectPage";

vi.mock("../../components/ui/PageTitle", () => ({
  default: ({ title }: { title: string }) => (
    <div data-testid="page-title">{title}</div>
  ),
}));

describe("CodeConnectPage", () => {
  it("renders when navigating to /codeconnect", () => {
    render(
      <MemoryRouter initialEntries={["/codeconnect"]}>
        <UserProvider>
          <Routes>
            <Route path="/codeconnect" element={<CodeConnectPage />} />
          </Routes>
        </UserProvider>
        ,
      </MemoryRouter>,
    );

    expect(screen.getByTestId("page-title")).toHaveTextContent(
      "Llista de projectes Code Connect",
    );
    expect(
      screen.getByRole("heading", { level: 2, name: /Code Connect/i }),
    ).toBeInTheDocument();
  });

  it("navigates to /codeconnect/create when clicking the button", () => {
    render(
      <MemoryRouter initialEntries={["/codeconnect"]}>
        <UserProvider>
          <Routes>
            <Route path="/codeconnect" element={<CodeConnectPage />} />
            <Route
              path="/codeconnect/create"
              element={<div>Create Code Connect Page</div>}
            />
          </Routes>
        </UserProvider>
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", { name: /Crear projecte/i });
    fireEvent.click(button);

    expect(screen.getByText("Create Code Connect Page")).toBeInTheDocument();
  });

  it("renders My projects button", () => {
    render(
      <MemoryRouter initialEntries={["/codeconnect"]}>
        <UserProvider>
          <Routes>
            <Route path="/codeconnect" element={<CodeConnectPage />} />
          </Routes>
        </UserProvider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("button", { name: /Els meus projectes/i }),
    ).toBeInTheDocument();
  });

  it("toggles my projects filter when clicking My projects button", () => {
    render(
      <MemoryRouter initialEntries={["/codeconnect"]}>
        <UserProvider>
          <Routes>
            <Route path="/codeconnect" element={<CodeConnectPage />} />
          </Routes>
        </UserProvider>
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", { name: /Els meus projectes/i });
    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });
});
