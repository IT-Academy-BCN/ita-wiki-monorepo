import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { UserProvider } from "../../../../context/UserContext";
import { Project } from "../../../../types/codeConnectTypes";
import ProjectCard from "../ProjectCard";

vi.mock("../../../../context/UserContext", async () => {
  const actual = await vi.importActual("../../../../context/UserContext");
  return {
    ...actual,
    useUserContext: () => ({
      user: { id: 1, name: "Test User" },
    }),
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UserProvider>
    <MemoryRouter>{children}</MemoryRouter>
  </UserProvider>
);

function makeProject(partial: Partial<Project> = {}): Project {
  const base: Project = {
    id: 1,
    title: "AnimalKing:habla con tus mascota con IA",
    duration: "1 mes",
    frontend: {
      tech: "Angular",
      logo: "../assets/technologies/angular-logo.svg",
      positions: 3,
      participants: [
        { name: "Natasha", avatar: "../assets/project-avatar.svg" },
        { name: "Roman", avatar: "../assets/project-avatar4.svg" },
      ],
    },
    backend: {
      tech: "Java",
      logo: "../assets/technologies/java-logo.svg",
      positions: 2,
      participants: [],
    },
    startDate: "01-10-2025",
    endDate: "13-11-2025",
  };
  return { ...base, ...partial } as Project;
}

describe("ProjectCard", () => {
  it("renders title, duration, and role labels", () => {
    const project = makeProject();
    render(<ProjectCard project={project} />, { wrapper });

    expect(screen.getByText(project.title)).toBeInTheDocument();
    expect(
      screen.getByText((t) => t.includes(`Durada: ${project.duration}`)),
    ).toBeInTheDocument();
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Inscripció")).toBeInTheDocument();
  });

  it("renders logos and participant avatars with correct alt text", () => {
    const project = makeProject();
    render(<ProjectCard project={project} />, { wrapper });

    const frontLogo = screen.getByAltText(
      project.frontend.tech,
    ) as HTMLImageElement;
    const backLogo = screen.getByAltText(
      project.backend.tech,
    ) as HTMLImageElement;
    expect(frontLogo).toBeInTheDocument();
    expect(backLogo).toBeInTheDocument();

    project.frontend.participants.forEach((p) => {
      const avatar = screen.getByAltText(p.name) as HTMLImageElement;
      expect(avatar).toBeInTheDocument();
    });
  });

  it("renders avatar placeholder when participant avatar is empty", () => {
    const project = makeProject({
      frontend: {
        tech: "Angular",
        logo: "../assets/technologies/angular-logo.svg",
        positions: 3,
        participants: [{ name: "Natasha", avatar: "" }],
      },
    });
    render(<ProjectCard project={project} />, { wrapper });
    const avatar = screen.getByAltText("Natasha") as HTMLImageElement;
    expect(avatar).toBeInTheDocument();
    expect(avatar.src).not.toBe("");
  });

  it('shows "+" buttons equal to available slots per role', () => {
    const project = makeProject();
    const availableFrontend =
      project.frontend.positions - project.frontend.participants.length;
    const availableBackend =
      project.backend.positions - project.backend.participants.length;

    render(<ProjectCard project={project} />, { wrapper });

    const addButtons = screen.getAllByRole("button", { name: "+" });
    expect(addButtons.length).toBe(availableFrontend + availableBackend);
  });

  it("renders a link to the project details route", () => {
    const project = makeProject();
    render(<ProjectCard project={project} />, { wrapper });

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", `/codeconnect/${project.id}`);
  });

  it("highlights the card and participant name when the current user is an accepted member", () => {
    const project = makeProject({
      backend: {
        tech: "Java",
        logo: "../assets/technologies/java-logo.svg",
        positions: 2,
        participants: [
          {
            name: "Test User",
            avatar: "../assets/project-avatar.svg",
            user_id: 1,
            status: "accepted",
          },
        ],
      },
    });

    render(<ProjectCard project={project} />, { wrapper });

    const card = screen.getByText(project.title).closest("div.flex.flex-col");
    expect(card).toHaveClass("border-primary");

    const figcaption = screen.getByText("Test User");
    expect(figcaption).toHaveClass("text-black");
  });

  it("does not highlight the card when the current user is not a member", () => {
    const project = makeProject();

    render(<ProjectCard project={project} />, { wrapper });

    const card = screen.getByText(project.title).closest("div.flex.flex-col");
    expect(card).toHaveClass("border-gray-500");
    expect(card).not.toHaveClass("border-primary");
  });
});
