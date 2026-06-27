import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, type Mock } from "vitest";
import useCodeConnectDetails from "../../hooks/useCodeConnectDetails";
import CodeConnectDetails from "../CodeConnectDetails";

vi.mock("react-router", () => ({
  useParams: () => ({ projectId: "1" }),
}));

vi.mock("../../hooks/useCodeConnectDetails");

vi.mock("../../components/code-connect/CloseProjectModal", () => ({
  default: ({
    isOpen,
    onClose,
    onConfirm,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (g: string, y: string) => Promise<void>;
  }) =>
    isOpen ? (
      <div data-testid="close-project-modal">
        <button onClick={() => onConfirm("", "")}>Confirmar</button>
        <button onClick={onClose}>Cancel·lar</button>
      </div>
    ) : null,
}));

vi.mock("../../components/code-connect/projectTeam/ProjectTeam", () => ({
  default: () => (
    <div data-testid="mock-project-team">Component ProjectTeam</div>
  ),
}));

vi.mock("../../utils/iconUtils", () => ({
  displayLanguageIcon: () => "fake-icon.svg",
}));

describe("CodeConnectDetails Page", () => {
  it("renders the project title and team when data arrives", () => {
    const mockProjectData = {
      data: {
        title: "Super Projecte de Prova",
        description: "Descripció de prova del projecte",
        roadmap: [
          { task: "Tarea 1", done: false },
          { task: "Tarea 2", done: false },
        ],
        contributors: [],
        time_duration: "2 setmanes",
        language_frontend: "react",
        language_backend: "node",
      },
    };

    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: mockProjectData,
      isLoading: false,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

    expect(screen.getByText("Super Projecte de Prova")).toBeTruthy();
    expect(screen.getByText("Descripció de prova del projecte")).toBeTruthy();
    expect(screen.getByText("Tarea 1")).toBeTruthy();
    expect(screen.getByTestId("mock-project-team")).toBeTruthy();
    expect(screen.getByText("Roadmap:")).toBeTruthy();
    expect(screen.getByText("Descripció:")).toBeTruthy();
  });

  it("renders the fallback message when description and roadmap are empty", () => {
    const mockProjectData = {
      data: {
        title: "Projecte Antic",
        description: "",
        roadmap: [],
        contributors: [],
        time_duration: "1 mes",
        language_frontend: "javascript",
        language_backend: "php",
      },
    };

    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: mockProjectData,
      isLoading: false,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

    expect(screen.getByText("Projecte Antic")).toBeTruthy();

    const fallbackMessages = screen.getAllByText(
      "Aquesta informació no està disponible a la base de dades.",
    );

    expect(fallbackMessages).toHaveLength(2);
  });

  it("renders the error message when the hook returns an error", () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: null,
      isLoading: false,
      errorMessage: "Error de connexió. Verifica la teva connexió a internet.",
    });

    render(<CodeConnectDetails />);

    expect(
      screen.getByText(
        "Error de connexió. Verifica la teva connexió a internet.",
      ),
    ).toBeTruthy();
  });

  it("renders the loading state when isLoading is true", () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: null,
      isLoading: true,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

    expect(screen.getByText("Carregant...")).toBeTruthy();
  });

  it("renders the 'Marcar com a complet' button", () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: {
        data: {
          title: "Projecte Test",
          description: "Descripció de prova",
          roadmap: [],
          contributors: [],
          time_duration: "2 setmanes",
          language_frontend: "react",
          language_backend: "node",
        },
      },
      isLoading: false,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

    expect(screen.getByText("Marcar com a complet")).toBeTruthy();
  });

  it("opens CloseProjectModal when clicking 'Marcar com a complet'", () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: {
        data: {
          title: "Projecte Test",
          description: "Descripció de prova",
          roadmap: [],
          contributors: [],
          time_duration: "2 setmanes",
          language_frontend: "react",
          language_backend: "node",
        },
      },
      isLoading: false,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

    fireEvent.click(screen.getByText("Marcar com a complet"));

    expect(screen.getByTestId("close-project-modal")).toBeTruthy();
  });

  it("shows '✓ Completat' after confirming in the modal", () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: {
        data: {
          title: "Projecte Test",
          description: "Descripció de prova",
          roadmap: [],
          contributors: [],
          time_duration: "2 setmanes",
          language_frontend: "react",
          language_backend: "node",
        },
      },
      isLoading: false,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

    fireEvent.click(screen.getByText("Marcar com a complet"));
    fireEvent.click(screen.getByText("Confirmar"));

    expect(screen.getByText("✓ Completat")).toBeTruthy();
  });

  it("closes the modal when clicking Cancel·lar", () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: {
        data: {
          title: "Projecte Test",
          description: "Descripció de prova",
          roadmap: [],
          contributors: [],
          time_duration: "2 setmanes",
          language_frontend: "react",
          language_backend: "node",
        },
      },
      isLoading: false,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

    fireEvent.click(screen.getByText("Marcar com a complet"));
    fireEvent.click(screen.getByText("Cancel·lar"));

    expect(screen.queryByTestId("close-project-modal")).toBeNull();
  });
});
