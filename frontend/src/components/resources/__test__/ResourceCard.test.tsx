import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ResourceCard from "../../ui/ResourceCard";
import { UserContext } from "../../../context/UserContext";
import { IntResource, IntUser } from "../../../types";

vi.mock("../../utils/iconUtils", () => ({
  displayLanguageIcon: vi.fn(() => "mock-icon-path.png"),
}));

const mockResource: IntResource = {
  id: 1,
  github_id: 123,
  title: "Recurs de prova",
  description: "Descripció de prova",
  url: "https://test.com",
  category: "React",
  type: "Video",
  like_count: 10,
  created_at: "2024-05-20T10:00:00Z",
  tags: ["Frontend", "Web"],
};

const renderWithContext = (user: Partial<IntUser> | null, props = {}) => {
  const mockContextValue = {
    user: user as IntUser,
    isAuthenticated: !!user,
    setUser: vi.fn(),
    signOut: vi.fn(),
    signIn: vi.fn(),
    saveUser: vi.fn(),
    error: null,
    setError: vi.fn(),
    loading: false,
    setIsLoading: vi.fn(),
  };

  return render(
    <UserContext.Provider value={mockContextValue}>
      <ResourceCard
        resource={mockResource}
        isBookmarked={false}
        toggleBookmark={vi.fn()}
        {...props}
      />
    </UserContext.Provider>,
  );
};

describe("ResourceCard Component", () => {
  it("hauria de renderitzar correctament el títol i la data", () => {
    renderWithContext({ role: "student" });

    expect(screen.getByText("Recurs de prova")).toBeDefined();
    expect(screen.getByText(/2024/)).toBeDefined();
  });

  it("hauria de cridar a toggleBookmark quan l'usuari és 'student' (té permís)", () => {
    const toggleBookmarkSpy = vi.fn();
    renderWithContext(
      { role: "student" },
      { toggleBookmark: toggleBookmarkSpy },
    );

    const bookmarkButton = screen.getByTestId("bookmark-button");
    fireEvent.click(bookmarkButton);

    expect(toggleBookmarkSpy).toHaveBeenCalledWith(mockResource);
  });

  it("hauria de mostrar el modal de 'Permisos insuficients' si l'usuari no té permís (ex: mentor)", async () => {
    renderWithContext({ role: "mentor" });

    const bookmarkButton = screen
      .getByTitle(/No tens permisos/i)
      .closest("div");
    if (bookmarkButton) fireEvent.click(bookmarkButton);

    // Verifiquem que apareix el text del modal definit a ResourceCard.tsx
    expect(screen.getByText("Permisos insuficients")).toBeDefined();
    expect(
      screen.getByText("No tens permisos per realitzar aquesta acció"),
    ).toBeDefined();
  });

  it("hauria de mostrar el modal si l'usuari no està loguejat", () => {
    renderWithContext(null);

    const bookmarkButton = screen.getByTitle(/Inicia sessió/i).closest("div");
    if (bookmarkButton) fireEvent.click(bookmarkButton);

    expect(screen.getByText("Permisos insuficients")).toBeDefined();
  });
});
