import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ProjectListUI from "../ProjectListUI";
import { UserProvider } from "../../../../context/UserContext";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>
    <MemoryRouter>{children}</MemoryRouter>
  </UserProvider>
);

const mockProject = {
  id: 1,
  title: "Test Project",
  frontend: {
    tech: "React",
    positions: 2,
    participants: [],
  },
  backend: {
    tech: "Node",
    positions: 2,
    participants: [],
  },
};

describe("ProjectListUI", () => {
  it("renders skeletons when showLoader is true", () => {
    render(<ProjectListUI projects={[]} showLoader={true} error={null} />, {
      wrapper,
    });
    expect(screen.getByText("Llista de projectes")).toBeDefined();
  });

  it("renders EmptyState when there is an error", () => {
    render(
      <ProjectListUI
        projects={[]}
        showLoader={false}
        error={new Error("Test error")}
      />,
      { wrapper },
    );
    expect(screen.getByText("Error al obtenir projectes")).toBeDefined();
    expect(
      screen.getByText("Hi ha hagut un problema. Torna-ho a provar."),
    ).toBeDefined();
  });

  it("renders EmptyState when there are no projects", () => {
    render(<ProjectListUI projects={[]} showLoader={false} error={null} />, {
      wrapper,
    });
    expect(screen.getByText("No hi ha projectes")).toBeDefined();
  });

  it("renders project list when data is available", () => {
    render(
      <ProjectListUI
        projects={[mockProject]}
        showLoader={false}
        error={null}
      />,
      { wrapper },
    );
    expect(screen.getByText("Test Project")).toBeDefined();
  });

  it("renders exactly 6 skeleton cards while loading", () => {
    render(<ProjectListUI projects={[]} showLoader={true} error={null} />, {
      wrapper,
    });
    expect(screen.getAllByTestId("skeleton-card")).toHaveLength(6);
  });

  it("hides skeletons after loading completes", () => {
    const { rerender } = render(
      <ProjectListUI projects={[]} showLoader={true} error={null} />,
      { wrapper },
    );

    expect(screen.getAllByTestId("skeleton-card")).toHaveLength(6);

    rerender(
      <ProjectListUI
        projects={[mockProject]}
        showLoader={false}
        error={null}
      />,
    );

    expect(screen.queryByTestId("skeleton-card")).toBeNull();
    expect(screen.getByText("Test Project")).toBeDefined();
  });
});
