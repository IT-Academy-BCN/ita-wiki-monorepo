import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ResourceCardHeader from "../ResourceCardHeader";
import { IntUser } from "../../../types";

vi.mock("../../../utils/iconUtils", () => ({
  displayLanguageIcon: () => "fake-icon-url.png",
}));

vi.mock("../../resources/BookmarkIconComponent", () => ({
  default: ({ marked }: { marked: boolean }) => (
    <div data-testid="bookmark-icon">{marked ? "Saved" : "Not Saved"}</div>
  ),
}));

const mockUser: IntUser = {
  id: 1,
  github_user_name: "test_github_user",
  github_id: 12345,
  name: "Test User",
  email: "test@test.com",
  password: "password123",
  role: "student",
  photoURL: "https://via.placeholder.com/150"
};

describe("ResourceCardHeader", () => {

  it("renders correctly and handles click when user has permission", () => {
    const handleBookmarkClick = vi.fn();

    render(
      <ResourceCardHeader
        user={mockUser}
        category="React"
        title="My Resource Title"
        isBookmarked={false}
        handleBookmarkClick={handleBookmarkClick}
        hasBookmarkPermission={true}
      />
    );

    expect(screen.getByText("My Resource Title")).toBeInTheDocument();

    const icon = screen.getByAltText("Icona de React");
    expect(icon).toHaveAttribute("src", "fake-icon-url.png");

    const bookmarkButton = screen.getByTestId("bookmark-icon").parentElement!;
    fireEvent.click(bookmarkButton);
    expect(handleBookmarkClick).toHaveBeenCalledTimes(1);
    
    expect(bookmarkButton).toHaveClass("cursor-pointer");
  });

  it("shows restricted state when user has no permission", () => {
    render(
      <ResourceCardHeader
        user={mockUser}
        category="React"
        title="Title"
        isBookmarked={false}
        handleBookmarkClick={() => {}}
        hasBookmarkPermission={false}
      />
    );

    const bookmarkButton = screen.getByTestId("bookmark-icon").parentElement!;
    
    expect(bookmarkButton).toHaveClass("cursor-not-allowed");
    
    expect(bookmarkButton).toHaveAttribute("title", expect.stringContaining("No tens permisos"));
  });

  it("shows login message when no user is present", () => {
    render(
      <ResourceCardHeader
        user={null}
        category="React"
        title="Title"
        isBookmarked={false}
        handleBookmarkClick={() => {}}
        hasBookmarkPermission={false}
      />
    );

    const bookmarkButton = screen.getByTestId("bookmark-icon").parentElement!;

    expect(bookmarkButton).toHaveAttribute("title", "Inicia sessió per desar recursos");
  });
});