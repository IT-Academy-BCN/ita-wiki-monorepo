import { render, screen, fireEvent } from "@testing-library/react";
import DropdownMenu from "./DropdownMenu";
import { vi } from "vitest";

const options = [
  { label: "Nou", value: "pending" },
  { label: "En progrés", value: "in_progress" },
  { label: "Tancat", value: "closed" },
];

describe("DropdownMenu", () => {
  it("should render the current value", () => {
    render(
      <DropdownMenu currentValue="Nou" options={options} onSelect={vi.fn()} />,
    );
    const button = screen.getByRole("button", { name: "Nou" });
    expect(button).toBeInTheDocument();
  });

  it("should open the dropdown when clicked", () => {
    render(
      <DropdownMenu currentValue="Nou" options={options} onSelect={vi.fn()} />,
    );
    const button = screen.getByRole("button", { name: "Nou" });
    fireEvent.click(button);

    expect(
      screen.getByRole("button", { name: "En progrés" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tancat" })).toBeInTheDocument();
  });

  it("should call onSelect with the correct value when an option is clicked", () => {
    const handleSelect = vi.fn();
    render(
      <DropdownMenu
        currentValue="Nou"
        options={options}
        onSelect={handleSelect}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Nou" }));
    fireEvent.click(screen.getByRole("button", { name: "Tancat" }));

    expect(handleSelect).toHaveBeenCalledWith("closed");
  });

  it("should close the dropdown after selecting an option", () => {
    render(
      <DropdownMenu currentValue="Nou" options={options} onSelect={vi.fn()} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Nou" }));
    fireEvent.click(screen.getByRole("button", { name: "Tancat" }));

    expect(
      screen.queryByRole("button", { name: "En progrés" }),
    ).not.toBeInTheDocument();
  });

  it("should disable the trigger button when disabled prop is true", () => {
    render(
      <DropdownMenu
        currentValue="Nou"
        options={options}
        onSelect={vi.fn()}
        disabled={true}
      />,
    );
    const button = screen.getByRole("button", { name: "Nou" });
    expect(button).toBeDisabled();
  });
});
