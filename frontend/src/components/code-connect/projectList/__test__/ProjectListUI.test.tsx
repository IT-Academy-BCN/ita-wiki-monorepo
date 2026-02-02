import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ProjectListUI from "../ProjectListUI";

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
    render(
      <MemoryRouter>
        <ProjectListUI projects={[]} showLoader={true} error={null} />
      </MemoryRouter>,
    );
    expect(screen.getByText("Llista de projectes")).toBeDefined();
  });

  it("muestra EmptyState con error cuando hay error", () => {
    render(
      <MemoryRouter>
        <ProjectListUI
          projects={[]}
          showLoader={false}
          error={new Error("Test error")}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Error al obtenir projectes")).toBeDefined();
    expect(
      screen.getByText("Hi ha hagut un problema. Torna-ho a provar."),
    ).toBeDefined();
  });

  it("muestra EmptyState cuando no hay proyectos", () => {
    render(
      <MemoryRouter>
        <ProjectListUI projects={[]} showLoader={false} error={null} />
      </MemoryRouter>,
    );
    expect(screen.getByText("No hi ha projectes")).toBeDefined();
  });

  it("muestra lista de proyectos cuando hay datos", () => {
    render(
      <MemoryRouter>
        <ProjectListUI
          projects={[mockProject]}
          showLoader={false}
          error={null}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Test Project")).toBeDefined();
  });

  it("renderiza exactamente 6 skeletons durante la carga", () => {
    render(
      <MemoryRouter>
        <ProjectListUI projects={[]} showLoader={true} error={null} />
      </MemoryRouter>,
    );
    expect(screen.getAllByTestId("skeleton-card")).toHaveLength(6);
  });
});
