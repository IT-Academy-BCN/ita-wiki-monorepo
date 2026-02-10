import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, test, expect } from "vitest";
import { AsideNavbarLink } from "../aside/AsideNavbarLink";

const MockIcon = () => <svg data-testid="mock-icon" />;

const renderNavLink = (isActive: boolean, path = "/test", label = "Test Link") => {
  return render(
    <MemoryRouter>
      <AsideNavbarLink
        path={path}
        label={label}
        isActive={isActive}
        icon={<MockIcon />}
      />
    </MemoryRouter>,
  );
}

describe("AsideNavbarLink Tests", () => {
  test("renders with active state", () => {
    renderNavLink(true);

    const link = screen.getByText("Test Link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass("!text-primary");
    expect(link).toHaveClass("!font-extrabold");
    expect(link).toHaveAttribute("href", "/test");

    const listItem = link.closest("li");
    expect(listItem).toHaveClass("bg-primary/15");
  });

  test("renders with inactive state", () => {
    renderNavLink(false);

    const link = screen.getByText("Test Link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass("!text-black");
    expect(link).toHaveClass("hover:!text-primary");
    expect(link).toHaveAttribute("href", "/test");

    const listItem = link.closest("li");
    expect(listItem).not.toHaveClass("bg-primary/15");
  });

  test("renders icon correctly", () => {
    renderNavLink(false);

    const icon = screen.getByTestId("mock-icon");
    expect(icon).toBeInTheDocument();
  });

  test("applies correct classes to icon span", () => {
    const { container } = renderNavLink(false);

    const iconSpan = container.querySelector("span");
    expect(iconSpan).toHaveClass("w-[2rem]");
    expect(iconSpan).toHaveClass("h-[2rem]");
  });

  test("link has correct structure with icon and label", () => {
    renderNavLink(true, "/home", "Home");

    const link = screen.getByText("Home");
    expect(link).toHaveClass("flex");
    expect(link).toHaveClass("items-center");
    expect(link).toHaveClass("gap-3");

    const icon = screen.getByTestId("mock-icon");
    expect(icon).toBeInTheDocument();
  });
});
