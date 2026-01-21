import { render, screen, fireEvent } from "@testing-library/react";
import DropdownButtonComponent from "./DropdownButtonComponent";
import { vi } from "vitest";

describe("DropdownButtonComponent", () => {
  it("should render the button with the provided title", () => {
    render(<DropdownButtonComponent title="Test Title" />);
    const button = screen.getByRole("button", { name: "Test Title" });
    expect(button).toBeInTheDocument();
  });

  it("should call onClick when the button is clicked", () => {
    const handleClick = vi.fn();
    render(<DropdownButtonComponent title="Click Me" onClick={handleClick} />);
    const button = screen.getByRole("button", { name: "Click Me" });

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should render the icon if provided", () => {
    const iconSrc = "test-icon.png";
    render(<DropdownButtonComponent title="With Icon" icon={iconSrc} />);
    const icon = screen.getByRole("img", { name: "With Icon icon" });

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("src", iconSrc);
  });

  it("should disable the button when the disabled prop is true", () => {
    render(<DropdownButtonComponent title="Disabled" disabled={true} />);
    const button = screen.getByRole("button", { name: "Disabled" });

    expect(button).toBeDisabled();
    expect(button).toHaveClass("cursor-default");
  });
});
