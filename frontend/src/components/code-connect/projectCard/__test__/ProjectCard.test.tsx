import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ProjectCard from "../ProjectCard";

import {} from "../../../ui/Modal/GenericModal";

vi.mock("../../../ui/Modal/GenericModal", () => ({
  default: ({
    title,
    isOpen,
    primaryButtonText,
    primaryButtonAction,
    secondaryButtonText,
    secondaryButtonAction,
    children,
  }: {
    title: string;
    isOpen: boolean;
    primaryButtonText?: string;
    primaryButtonAction?: (() => void) | undefined;
    secondaryButtonText?: string;
    secondaryButtonAction?: (() => void) | undefined;
    children: React.ReactNode;
  }) =>
    isOpen ? (
      <div>
        <h4>{title}</h4>
        <div>{children}</div>
        {primaryButtonText ? (
          <button type="button" onClick={primaryButtonAction}>
            {primaryButtonText}
          </button>
        ) : null}
        {secondaryButtonText ? (
          <button type="button" onClick={secondaryButtonAction}>
            {secondaryButtonText}
          </button>
        ) : null}
      </div>
    ) : null,
}));

vi.mock("../../../atoms/ButtonComponent", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
}));

vi.mock("../../../../utils/iconUtils", () => ({
  displayLanguageIcon: () => "icon.svg",
}));

vi.mock("../TeamRow", () => ({
  default: ({
    emptySlots,
    slotIndexOffset = 0,
    onEmptySlotClick,
  }: {
    emptySlots: number;
    slotIndexOffset?: number;
    onEmptySlotClick?: (slotIndex: number) => void;
  }) => (
    <div>
      {Array.from({ length: emptySlots }).map((_, index) => {
        const slotIndex = slotIndexOffset + index;
        return (
          <button
            key={`plus-${slotIndex}`}
            type="button"
            aria-label="+"
            onClick={() => onEmptySlotClick?.(slotIndex)}
          >
            +
          </button>
        );
      })}
    </div>
  ),
}));

const joinModalOpenMock = vi.fn();

vi.mock("../../../../hooks/useProjectJoin", () => ({
  useProjectJoin: () => ({
    joinModal: {
      isOpen: false,
      open: joinModalOpenMock,
      close: vi.fn(),
      confirm: vi.fn(),
      isSubmitting: false,
      selectedSlot: null,
    },
    decisionModal: {
      isOpen: false,
      open: vi.fn(),
      close: vi.fn(),
      accept: vi.fn(),
      reject: vi.fn(),
    },
  }),
}));

vi.mock("../../../../hooks/useProjectContributors", () => ({
  useProjectContributors: () => ({
    getTeamByRole: (role: string) => {
      if (role === "frontend") {
        return {
          members: [
            { name: "Natasha", avatar: "natasha.png" },
            { name: "Roman", avatar: "roman.png" },
          ],
          emptySlots: 1,
        };
      }
      return {
        members: [{ name: "Bruce", avatar: "bruce.png" }],
        emptySlots: 2,
      };
    },
  }),
}));

beforeEach(() => {
  joinModalOpenMock.mockClear();
});

const project = {
  id: 1,
  title: "AnimalKing",
  time_duration: "1 mes",
  language_frontend: "Angular",
  language_backend: "Java",
  contributors: [],
};

describe("ProjectCard", () => {
  it("renderitza títol i seccions principals", () => {
    render(
      <MemoryRouter>
        <ProjectCard project={project} />
      </MemoryRouter>,
    );

    expect(screen.getByText("AnimalKing")).toBeInTheDocument();
    expect(screen.getByText("Equip")).toBeInTheDocument();
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Termini d'inscripció")).toBeInTheDocument();
    expect(screen.getByText("Durada")).toBeInTheDocument();
    expect(screen.getByText("1 mes")).toBeInTheDocument();
  });

  it("renderitza els logos amb alt correcte", () => {
    render(
      <MemoryRouter>
        <ProjectCard project={project} />
      </MemoryRouter>,
    );

    expect(screen.getByAltText("Angular")).toBeInTheDocument();
    expect(screen.getByAltText("Java")).toBeInTheDocument();
  });

  it("renderitza avatars del team (mock) amb alt correcte", () => {
    render(
      <MemoryRouter>
        <ProjectCard project={project} />
      </MemoryRouter>,
    );

    expect(screen.getByAltText("Natasha")).toBeInTheDocument();
    expect(screen.getByAltText("Roman")).toBeInTheDocument();
    expect(screen.getByAltText("Bruce")).toBeInTheDocument();
  });

  it('mostra els "+" segons emptySlots i crida joinModal.open amb rol correcte', () => {
    render(
      <MemoryRouter>
        <ProjectCard project={project} />
      </MemoryRouter>,
    );

    const addButtons = screen.getAllByRole("button", { name: "+" });
    expect(addButtons).toHaveLength(3);

    fireEvent.click(addButtons[0]); // frontend
    expect(joinModalOpenMock).toHaveBeenCalledWith({
      area: "frontend",
      index: expect.any(Number),
      role: "Frontend Developer",
    });

    fireEvent.click(addButtons[2]); // backend
    expect(joinModalOpenMock).toHaveBeenCalledWith({
      area: "backend",
      index: expect.any(Number),
      role: "Backend Developer",
    });
  });

  it("té un link al detall del projecte", () => {
    render(
      <MemoryRouter>
        <ProjectCard project={project} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: "AnimalKing" });
    expect(link).toHaveAttribute("href", "/codeconnect/1");
  });

  it("si rep onClick, clicar la card el crida; clicar link o botó no", () => {
    const onCardClick = vi.fn();

    render(
      <MemoryRouter>
        <ProjectCard project={project} onClick={onCardClick} />
      </MemoryRouter>,
    );

    const article = screen.getByLabelText("project-card");
    fireEvent.click(article);
    expect(onCardClick).toHaveBeenCalledWith(1);

    onCardClick.mockClear();

    fireEvent.click(screen.getByRole("link", { name: "AnimalKing" }));
    expect(onCardClick).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Apuntar-me" }));
    expect(onCardClick).not.toHaveBeenCalled();
  });

  it("tecles Enter i Espai criden onClick quan existeix", () => {
    const onCardClick = vi.fn();

    render(
      <MemoryRouter>
        <ProjectCard project={project} onClick={onCardClick} />
      </MemoryRouter>,
    );

    const article = screen.getByLabelText("project-card");

    fireEvent.keyDown(article, { key: "Enter" });
    fireEvent.keyDown(article, { key: " " });

    expect(onCardClick).toHaveBeenCalledTimes(2);
  });
});
