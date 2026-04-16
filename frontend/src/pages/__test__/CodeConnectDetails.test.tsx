import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi, type Mock } from "vitest";
import CodeConnectDetails from "../CodeConnectDetails";
import useCodeConnectDetails from "../../hooks/useCodeConnectDetails";

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

describe("CodeConnectDetails Page", () => {
  test("renderitza el títol del projecte, la descripció, el roadmap i l'equip quan arriben les dades", () => {
    const mockProjectData = {
      data: {
        title: "Super Projecte de Prova",
        description: "Descripció de prova del projecte",
        roadmap: "Roadmap de prova del projecte",
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
    expect(screen.getByText("Roadmap de prova del projecte")).toBeTruthy();
    expect(screen.getByTestId("mock-project-team")).toBeTruthy();
    expect(screen.getByText("Roadmap:")).toBeTruthy();
    expect(screen.getByText("Descripció:")).toBeTruthy();
  });

  test("renderitza el missatge fallback quan description i roadmap venen buits", () => {
    const mockProjectData = {
      data: {
        title: "Projecte Antic",
        description: "",
        roadmap: "",
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

  test("renderitza el missatge d'error quan el hook retorna error", () => {
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

  test("renderitza l'estat de càrrega quan isLoading és true", () => {
    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: null,
      isLoading: true,
      errorMessage: null,
    });

    render(<CodeConnectDetails />);

    expect(screen.getByText("Carregant...")).toBeTruthy();
  });
});
