import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DropdownItem from "../DropdownItem";

describe("DropdownItem", () => {
  it("renders label", () => {
    render(<DropdownItem icon={<span>Icon</span>} label="Test Label" />);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders icon", () => {
    render(
      <DropdownItem icon={<span data-testid="icon">Icon</span>} label="Test" />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const mockOnClick = vi.fn();
    render(
      <DropdownItem
        icon={<span>Icon</span>}
        label="Click me"
        onClick={mockOnClick}
      />,
    );

    fireEvent.click(screen.getByText("Click me"));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("has correct hover classes", () => {
    render(<DropdownItem icon={<span>Icon</span>} label="Test" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-[#B91879]", "hover:text-white");
  });
});
