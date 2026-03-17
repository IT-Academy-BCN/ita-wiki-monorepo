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
  it("muestra skeletons cuando showLoader es true", () => {
    render(<ProjectListUI projects={[]} showLoader={true} error={null} />, {
      wrapper,
    });
    expect(screen.getByText("Llista de projectes")).toBeDefined();
    // Skeletons se renderizan
  });

  it("muestra EmptyState con error cuando hay error", () => {
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

  it("muestra EmptyState cuando no hay proyectos", () => {
    render(<ProjectListUI projects={[]} showLoader={false} error={null} />, {
      wrapper,
    });
    expect(screen.getByText("No hi ha projectes")).toBeDefined();
  });

  it("muestra lista de proyectos cuando hay datos", () => {
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

  it("renderiza exactamente 6 skeletons durante la carga", () => {
    render(<ProjectListUI projects={[]} showLoader={true} error={null} />, {
      wrapper,
    });
    expect(screen.getAllByTestId("skeleton-card")).toHaveLength(6);
  });
});
