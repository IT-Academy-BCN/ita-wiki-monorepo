import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, type Mock } from "vitest";
import { closeCodeConnectProject } from "../../api/endPointCodeConnect";
import useCodeConnectDetails from "../../hooks/useCodeConnectDetails";
import CodeConnectDetails from "../CodeConnectDetails";

vi.mock("react-router", () => ({
  useParams: () => ({ projectId: "1" }),
}));

vi.mock("../../hooks/useCodeConnectDetails");

vi.mock("../../components/code-connect/projectTeam/ProjectTeam", () => ({
  default: () => (
    <div data-testid="mock-project-team">Component ProjectTeam</div>
  ),
}));

vi.mock("../../utils/iconUtils", () => ({
  displayLanguageIcon: () => "fake-icon.svg",
}));

vi.mock("../../context/UserContext", () => ({
  useUserContext: () => ({ user: { id: 1 } }),
}));

vi.mock("../../api/endPointCodeConnect", () => ({
  closeCodeConnectProject: vi.fn(),
}));

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

  it("renders the 'Marcar como completado' button", () => {
    const mockProjectData = {
      data: {
        title: "Projecte Test",
        description: "Descripció de prova",
        roadmap: [],
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

    expect(screen.getByText("Marcar com a complet")).toBeTruthy();
  });

  it("toggles to 'Completat' badge after clicking the button", () => {
    const mockProjectData = {
      data: {
        title: "Projecte Test",
        description: "Descripció de prova",
        roadmap: [],
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

    const button = screen.getByRole("button", {
      name: /marcar com a complet/i,
    });
    fireEvent.click(button);

    expect(screen.getByText(/Completat/)).toBeTruthy();
  });

  it("shows '✓ Completat' when project_status is already completed", () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: {
        data: {
          id: 1,
          user_id: 1,
          title: "Projecte Test",
          description: "Descripció de prova",
          roadmap: [],
          contributors: [],
          time_duration: "2 setmanes",
          language_frontend: "react",
          language_backend: "node",
          project_status: "completed",
        },
      },
      isLoading: false,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

    expect(screen.getByText("✓ Completat")).toBeTruthy();
    expect(screen.queryByText("Marcar com a complet")).toBeNull();
  });

  it("does not show the button when the user is not the owner", () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: {
        data: {
          id: 1,
          user_id: 99,
          title: "Projecte Test",
          description: "Descripció de prova",
          roadmap: [],
          contributors: [],
          time_duration: "2 setmanes",
          language_frontend: "react",
          language_backend: "node",
          project_status: "in_progress",
        },
      },
      isLoading: false,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

    expect(screen.queryByText("Marcar com a complet")).toBeNull();
  });

  it("calls closeCodeConnectProject and reloads when confirming", async () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: {
        data: {
          id: 1,
          user_id: 1,
          title: "Projecte Test",
          description: "Descripció de prova",
          roadmap: [],
          contributors: [],
          time_duration: "2 setmanes",
          language_frontend: "react",
          language_backend: "node",
          project_status: "in_progress",
        },
      },
      isLoading: false,
      errorMessage: null,
    });
    (closeCodeConnectProject as Mock).mockResolvedValue({});
    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      value: { reload: reloadMock },
      writable: true,
    });

    render(<CodeConnectDetails />);

    fireEvent.click(screen.getByText("Marcar com a complet"));
    fireEvent.click(screen.getByText("Confirmar"));

    await waitFor(() => {
      expect(closeCodeConnectProject).toHaveBeenCalledWith(1, {
        github_url: undefined,
        youtube_url: undefined,
      });
      expect(reloadMock).toHaveBeenCalled();
    });
  });
});
