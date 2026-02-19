import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, test, expect } from "vitest";
import { AsideConfigLink } from "../aside/AsideConfigLink";

const MockIcon = () => <svg data-testid="mock-icon" />;

const renderConfigLink = ({
  isActive,
  path = "/test",
  label = "Test Config",
}: {
  isActive: boolean;
  path?: string;
  label?: string;
}) => {
  return render(
    <MemoryRouter>
      <AsideConfigLink
        path={path}
        label={label}
        isActive={isActive}
        icon={<MockIcon />}
      />
    </MemoryRouter>,
  );
};

describe("AsideConfigLink Tests", () => {
  test("renders with active state", () => {
    renderConfigLink({ isActive: true });

    const link = screen.getByText("Test Config");
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass("!text-primary");
    expect(link).toHaveClass("!font-extrabold");
    expect(link).toHaveAttribute("href", "/test");

    const listItem = link.closest("li");
    expect(listItem).toHaveClass("bg-primary/15");
  });

  test("renders with inactive state", () => {
    renderConfigLink({ isActive: false });

    const link = screen.getByText("Test Config");
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass("!text-black");
    expect(link).toHaveClass("hover:!text-primary");
    expect(link).toHaveAttribute("href", "/test");

    const listItem = link.closest("li");
    expect(listItem).not.toHaveClass("bg-primary/15");
  });

  test("renders icon correctly", () => {
    renderConfigLink({ isActive: false });

    const icon = screen.getByTestId("mock-icon");
    expect(icon).toBeInTheDocument();
  });

  test("applies correct classes to icon span", () => {
    const { container } = renderConfigLink({ isActive: false });

    const iconSpan = container.querySelector("span");
    expect(iconSpan).toHaveClass("w-[1.25rem]");
    expect(iconSpan).toHaveClass("h-[1.25rem]");
    expect(iconSpan).toHaveClass("shrink-0");
  });

  test("link has correct structure with icon and label", () => {
    renderConfigLink({
      isActive: true,
      path: "/config",
      label: "Configuració",
    });

    const link = screen.getByText("Configuració");
    expect(link).toHaveClass("flex");
    expect(link).toHaveClass("items-center");
    expect(link).toHaveClass("gap-2");

    const icon = screen.getByTestId("mock-icon");
    expect(icon).toBeInTheDocument();
  });
});
