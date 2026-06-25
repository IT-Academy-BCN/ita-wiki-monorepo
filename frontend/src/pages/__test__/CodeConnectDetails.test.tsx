import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, type Mock } from "vitest";
import useCodeConnectDetails from "../../hooks/useCodeConnectDetails";
import CodeConnectDetails from "../CodeConnectDetails";

vi.mock("react-router", () => ({
  useParams: () => ({ projectId: "1" }),
}));

vi.mock("../../hooks/useCodeConnectDetails");

vi.mock("../../context/UserContext", () => ({
  useUserContext: () => ({ user: { id: 1 } }),
}));

vi.mock("../../components/code-connect/projectTeam/ProjectTeam", () => ({
  default: () => (
    <div data-testid="mock-project-team">Component ProjectTeam</div>
  ),
}));

vi.mock("../../components/code-connect/CloseProjectModal", () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="close-project-modal">
        <button onClick={onClose}>Cancel·lar</button>
      </div>
    ) : null,
}));

vi.mock("../../utils/iconUtils", () => ({
  displayLanguageIcon: () => "fake-icon.svg",
}));

vi.mock("../../api/endPointCodeConnect", () => ({
  closeCodeConnectProject: vi.fn().mockResolvedValue({}),
}));

const baseProject = {
  id: 1,
  user_id: 1,
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
  project_status: "in_progress" as const,
};

describe("CodeConnectDetails Page", () => {
  it("renders the project title and team when data arrives", () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: { data: baseProject },
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
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: {
        data: { ...baseProject, description: "", roadmap: [] },
      },
      isLoading: false,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

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

  it("shows 'Marcar com a complet' button when user is the owner and project is in_progress", () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: { data: baseProject },
      isLoading: false,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

    expect(screen.getByText("Marcar com a complet")).toBeTruthy();
  });

  it("shows '✓ Completat' badge when user is the owner and project is completed", () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: {
        data: { ...baseProject, project_status: "completed" },
      },
      isLoading: false,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

    expect(screen.getByText("✓ Completat")).toBeTruthy();
    expect(screen.queryByText("Marcar com a complet")).toBeNull();
  });

  it("does not show the button when user is not the owner", () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: {
        data: { ...baseProject, user_id: 99 },
      },
      isLoading: false,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

    expect(screen.queryByText("Marcar com a complet")).toBeNull();
    expect(screen.queryByText("✓ Completat")).toBeNull();
  });

  it("opens CloseProjectModal when clicking 'Marcar com a complet'", () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: { data: baseProject },
      isLoading: false,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

    fireEvent.click(screen.getByText("Marcar com a complet"));

    expect(screen.getByTestId("close-project-modal")).toBeTruthy();
  });

  it("closes CloseProjectModal when clicking cancel", () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: { data: baseProject },
      isLoading: false,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

    fireEvent.click(screen.getByText("Marcar com a complet"));
    expect(screen.getByTestId("close-project-modal")).toBeTruthy();

    fireEvent.click(screen.getByText("Cancel·lar"));
    expect(screen.queryByTestId("close-project-modal")).toBeNull();
  });
});
