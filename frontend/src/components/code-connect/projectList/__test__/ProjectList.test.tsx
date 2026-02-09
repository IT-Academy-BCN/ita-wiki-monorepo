import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ProjectList from "../ProjectList";

// Mocks hook modules
import { useMinLoading } from "../../../../hooks/useMinLoading";
import { useProjects } from "../../../../hooks/useCodeConnectGetAllProjects";

vi.mock("../../../../hooks/useMinLoading", () => ({
  useMinLoading: vi.fn(),
}));

vi.mock("../../../../hooks/useCodeConnectGetAllProjects", () => ({
  useProjects: vi.fn(),
}));

// Mocks UI components
vi.mock("../../ui/EmptyState", () => ({
  default: ({ text, subtext }: { text: string; subtext?: string }) => (
    <div>
      <p>{text}</p>
      {subtext ? <p>{subtext}</p> : null}
    </div>
  ),
}));

vi.mock("../CodeConnectCardSkeleton", () => ({
  default: () => <div data-testid="skeleton-card" />,
}));

vi.mock("../projectCard/ProjectCard", () => ({
  default: ({ project }: { project: { title: string } }) => (
    <div>{project.title}</div>
  ),
}));

const useMinLoadingMock = vi.mocked(useMinLoading);
const useProjectsMock = vi.mocked(useProjects);

beforeEach(() => {
  useMinLoadingMock.mockReturnValue(false);
  useProjectsMock.mockReturnValue({
    projects: [],
    isLoading: false,
    errorMessage: null,
  });
});

describe("ProjectList", () => {
  it("mostra skeletons quan està carregant i no hi ha error", () => {
    useMinLoadingMock.mockReturnValueOnce(true);
    useProjectsMock.mockReturnValueOnce({
      projects: [],
      isLoading: true,
      errorMessage: null,
    });

    render(
      <MemoryRouter>
        <ProjectList />
      </MemoryRouter>,
    );

    expect(screen.getByText("Llista de projectes")).toBeInTheDocument();
    expect(screen.getAllByTestId("skeleton-card")).toHaveLength(6);
  });

  it("mostra EmptyState d'error quan hi ha errorMessage", () => {
    useProjectsMock.mockReturnValueOnce({
      projects: [],
      isLoading: false,
      errorMessage: "boom",
    });

    render(
      <MemoryRouter>
        <ProjectList />
      </MemoryRouter>,
    );

    expect(screen.getByText("Error al obtenir projectes")).toBeInTheDocument();
    expect(
      screen.getByText("Hi ha hagut un problema. Torna-ho a provar."),
    ).toBeInTheDocument();
  });

  it("mostra EmptyState quan no hi ha projectes i no carrega", () => {
    useProjectsMock.mockReturnValueOnce({
      projects: [],
      isLoading: false,
      errorMessage: null,
    });

    render(
      <MemoryRouter>
        <ProjectList />
      </MemoryRouter>,
    );

    expect(screen.getByText("No hi ha projectes")).toBeInTheDocument();
  });

  it("mostra projectes quan n'hi ha", () => {
    useProjectsMock.mockReturnValueOnce({
      projects: [
        {
          id: 1,
          title: "React Project",
          time_duration: "1 mes",
          language_frontend: "react",
          language_backend: "java",
          contributors: [],
        },
      ],
      isLoading: false,
      errorMessage: null,
    });

    render(
      <MemoryRouter>
        <ProjectList />
      </MemoryRouter>,
    );

    expect(screen.getByText("React Project")).toBeInTheDocument();
  });

  it("filtra per tecnologia quan es passa filter", () => {
    useProjectsMock.mockReturnValueOnce({
      projects: [
        {
          id: 1,
          title: "React Project",
          time_duration: "1 mes",
          language_frontend: "react",
          language_backend: "java",
          contributors: [],
        },
        {
          id: 2,
          title: "PHP Project",
          time_duration: "2 mesos",
          language_frontend: "php",
          language_backend: "php",
          contributors: [],
        },
      ],
      isLoading: false,
      errorMessage: null,
    });

    render(
      <MemoryRouter>
        <ProjectList filter="react" />
      </MemoryRouter>,
    );

    expect(screen.getByText("React Project")).toBeInTheDocument();
    expect(screen.queryByText("PHP Project")).toBeNull();
  });
});
