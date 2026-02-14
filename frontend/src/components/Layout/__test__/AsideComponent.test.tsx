import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { vi, describe, test, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import AsideComponent from "../AsideComponent";
import { useUserContext } from "../../../context/UserContext";
import { contentForTechnicalTest } from "../../technical-test/languageLabelsContent";
import userEvent from "@testing-library/user-event";

const mockUseLocation = vi.fn();
const mockUseNavigate = vi.fn();

vi.mock("../../../context/UserContext", () => ({
  useUserContext: vi.fn().mockReturnValue({
    user: null,
    isAuthenticated: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
    error: null,
    setError: vi.fn(),
    saveUser: vi.fn(),
    setUser: vi.fn(),
    loading: false,
    setIsLoading: vi.fn(),
  }),
}));

vi.mock("../../../assets/technologies/sql-logo.svg?react", () => ({
  default: () => <svg data-testid="sql-icon" />,
}));
vi.mock("../../../assets/technologies/python-logo.svg?react", () => ({
  default: () => <svg data-testid="python-icon" />,
}));
vi.mock("../../../assets/technologies/typescript-logo.svg?react", () => ({
  default: () => <svg data-testid="ts-icon" />,
}));
vi.mock("../../../assets/technologies/javascript-logo.svg?react", () => ({
  default: () => <svg data-testid="js-icon" />,
}));
vi.mock("../../../assets/technologies/java-logo.svg?react", () => ({
  default: () => <svg data-testid="java-icon" />,
}));
vi.mock("../../../assets/technologies/php-logo.svg?react", () => ({
  default: () => <svg data-testid="php-icon" />,
}));
vi.mock("../../../assets/technologies/react-logo.svg?react", () => ({
  default: () => <svg data-testid="react-icon" />,
}));

vi.mock("react-router-dom", () => {
  const actual = vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
    useNavigate: () => mockUseNavigate(),
  };
});

describe("AsideComponent Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseLocation.mockReturnValue({
      pathname: "/resources",
      search: "",
      hash: "",
      state: null,
      key: "default",
    });

    mockUseNavigate.mockReturnValue(vi.fn());
  });

  test("renders user sections when logged in", () => {
    vi.mocked(useUserContext).mockReturnValue({
      user: {
        id: 12345,
        github_id: 12345,
        name: "Test User",
        github_user_name: "testuser",
        email: "test@example.com",
        password: "hashedpass",
        photoURL: "https://example.com/photo.jpg",
      },
      isAuthenticated: true,
      signIn: vi.fn(),
      signOut: vi.fn(),
      error: null,
      setError: vi.fn(),
      saveUser: vi.fn(),
      setUser: vi.fn(),
      loading: false,
      setIsLoading: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AsideComponent />
      </MemoryRouter>,
    );

    expect(screen.getByText("Els meus recursos")).toBeInTheDocument();
    expect(screen.getByText("Guardats")).toBeInTheDocument();
    expect(screen.getByText("Creats")).toBeInTheDocument();
  });

  test("should render 'Inici' link", () => {
    vi.mocked(useUserContext).mockReturnValue({
      user: null,
      isAuthenticated: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      error: null,
      setError: vi.fn(),
      saveUser: vi.fn(),
      setUser: vi.fn(),
      loading: false,
      setIsLoading: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AsideComponent />
      </MemoryRouter>,
    );

    expect(screen.getByText("Inici")).toBeInTheDocument();
  });

  test("should render 'Codeconnect' link", () => {
    vi.mocked(useUserContext).mockReturnValue({
      user: null,
      isAuthenticated: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      error: null,
      setError: vi.fn(),
      saveUser: vi.fn(),
      setUser: vi.fn(),
      loading: false,
      setIsLoading: vi.fn(),
    });

    render(
      <MemoryRouter>
        <AsideComponent />
      </MemoryRouter>,
    );

    const codeConnectLink = screen.getByText("Codeconnect");

    expect(codeConnectLink).toBeInTheDocument();
    expect(codeConnectLink).toHaveAttribute("href", "/codeconnect");
  });

  test("should navigate to /codeconnect when clicked", async () => {
    vi.mocked(useUserContext).mockReturnValue({
      user: null,
      isAuthenticated: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
      error: null,
      setError: vi.fn(),
      saveUser: vi.fn(),
      setUser: vi.fn(),
      loading: false,
      setIsLoading: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <AsideComponent />
        <Routes>
          <Route path="/codeconnect" element={<div>Code Connect Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    const codeConnectLink = screen.getByText("Codeconnect");
    const user = userEvent.setup();
    await user.click(codeConnectLink);

    expect(await screen.findByText("Code Connect Page")).toBeInTheDocument();
  });

  test("contentForTechnicalTest has correct labels and length", () => {
    const expectedLabels = [
      "React",
      "SQL",
      "JavaScript",
      "TypeScript",
      "Java",
      "PHP",
      "Python",
    ];

    expect(contentForTechnicalTest).toHaveLength(expectedLabels.length);

    expectedLabels.forEach((label, index) => {
      expect(contentForTechnicalTest[index].label).toBe(label);
      expect(typeof contentForTechnicalTest[index].icon).toBe("function");
    });
  });

  test("contentForTechnicalTest icons are functions", () => {
    contentForTechnicalTest.forEach((item) => {
      expect(typeof item.icon).toBe("function");
    });
  });
});
