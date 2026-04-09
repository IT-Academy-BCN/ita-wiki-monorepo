import { vi, describe, test, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HeaderComponent from "../HeaderComponent";
import { MemoryRouter } from "react-router";
import type { TypUserRole } from "../../../types";

const { mockUpdateUserRole } = vi.hoisted(() => ({
  mockUpdateUserRole: vi.fn().mockResolvedValue(true),
}));

vi.mock("../../../hooks/useChangeUserRole", () => ({
  useChangeUserRole: () => ({
    isChanging: false,
    updateUserRole: mockUpdateUserRole,
  }),
}));

const mockUseUserContext = vi.fn();
vi.mock("../../../context/UserContext", async () => {
  const actual = await vi.importActual("../../../context/UserContext");
  return {
    ...actual,
    useUserContext: () => mockUseUserContext(),
  };
});

const baseContext = {
  user: null,
  isAuthenticated: false,
  signIn: vi.fn(),
  signOut: vi.fn(),
  saveUser: vi.fn(),
  setUser: vi.fn(),
  error: null,
  setError: vi.fn(),
  loading: false,
  setIsLoading: vi.fn(),
};

beforeEach(() => {
  mockUseUserContext.mockReturnValue(baseContext);
  mockUpdateUserRole.mockResolvedValue(true);
});

describe("HeaderComponent Language Dropdown", () => {
  test("shows 'CA' as selected language and dropdown contains CA, ES and EN", () => {
    render(
      <MemoryRouter>
        <HeaderComponent />
      </MemoryRouter>,
    );

    const selectedLanguage = screen.getByText("CA", { selector: "span" });
    expect(selectedLanguage).toBeInTheDocument();

    const languageButton = selectedLanguage.closest("button");
    if (languageButton) fireEvent.click(languageButton);

    expect(screen.getByRole("button", { name: "CA" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ES" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument();
  });
});

describe("HeaderComponent role change", () => {
  test("calls updateUserRole with 'mentor' when mentor is selected from role dropdown", async () => {
    mockUseUserContext.mockReturnValue({
      ...baseContext,
      user: {
        id: 1,
        name: "Test User",
        github_user_name: "testuser",
        role: "student" as TypUserRole,
        github_id: 123,
        photoURL: "",
      },
      isAuthenticated: true,
    });

    render(
      <MemoryRouter>
        <HeaderComponent />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTitle("testuser"));

    fireEvent.click(screen.getByTitle("student"));

    fireEvent.click(screen.getByRole("button", { name: "mentor" }));

    await waitFor(() => {
      expect(mockUpdateUserRole).toHaveBeenCalledWith("mentor");
    });
  });
});
