import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, test, expect } from "vitest";
import { AsideNavbarLink } from "../aside/AsideNavbarLink";

const MockIcon = () => <svg data-testid="mock-icon" />;

describe("AsideNavbarLink Tests", () => {
  test("renders with active state", () => {
    render(
      <MemoryRouter>
        <AsideNavbarLink
          path="/test"
          label="Test Link"
          isActive={true}
          icon={<MockIcon />}
        />
      </MemoryRouter>
    );

    const link = screen.getByText("Test Link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass("!text-primary");
    expect(link).toHaveClass("!font-extrabold");
    expect(link).toHaveAttribute("href", "/test");

    const listItem = link.closest("li");
    expect(listItem).toHaveClass("bg-primary/15");
  });

  test("renders with inactive state", () => {
    render(
      <MemoryRouter>
        <AsideNavbarLink
          path="/test"
          label="Test Link"
          isActive={false}
          icon={<MockIcon />}
        />
      </MemoryRouter>
    );

    const link = screen.getByText("Test Link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass("!text-black");
    expect(link).toHaveClass("hover:!text-primary");
    expect(link).toHaveAttribute("href", "/test");

    const listItem = link.closest("li");
    expect(listItem).not.toHaveClass("bg-primary/15");
  });

  test("renders icon correctly", () => {
    render(
      <MemoryRouter>
        <AsideNavbarLink
          path="/test"
          label="Test Link"
          isActive={false}
          icon={<MockIcon />}
        />
      </MemoryRouter>
    );

    const icon = screen.getByTestId("mock-icon");
    expect(icon).toBeInTheDocument();
  });

  test("applies correct classes to icon span", () => {
    const { container } = render(
      <MemoryRouter>
        <AsideNavbarLink
          path="/test"
          label="Test Link"
          isActive={false}
          icon={<MockIcon />}
        />
      </MemoryRouter>
    );

    const iconSpan = container.querySelector("span");
    expect(iconSpan).toHaveClass("w-[2rem]");
    expect(iconSpan).toHaveClass("h-[2rem]");
  });

  test("link has correct structure with icon and label", () => {
    render(
      <MemoryRouter>
        <AsideNavbarLink
          path="/home"
          label="Home"
          isActive={true}
          icon={<MockIcon />}
        />
      </MemoryRouter>
    );

    const link = screen.getByText("Home");
    expect(link).toHaveClass("flex");
    expect(link).toHaveClass("items-center");
    expect(link).toHaveClass("gap-3");
    
    const icon = screen.getByTestId("mock-icon");
    expect(icon).toBeInTheDocument();
  });
});
