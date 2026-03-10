import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LikesSortButton from "../LikesSortButton";

describe("LikesSortButton", () => {
  it("renders the button with text Likes", () => {
    render(<LikesSortButton />);
    expect(screen.getByText("Likes")).toBeInTheDocument();
  });

  it("is inactive by default", () => {
    render(<LikesSortButton />);
    expect(screen.getByRole("button")).toHaveClass("bg-white");
  });

  it("applies active styles when isActive is true", () => {
    render(<LikesSortButton isActive />);
    expect(screen.getByRole("button")).toHaveClass("text-white");
  });

  it("calls onClick when clicked", () => {
    const mockOnClick = vi.fn();
    render(<LikesSortButton onClick={mockOnClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
