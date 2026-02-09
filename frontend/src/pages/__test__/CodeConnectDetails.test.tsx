// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, type Mock } from "vitest";
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
  it("renderitza el títol del projecte i l'equip quan arriben les dades", () => {
    const mockProjectData = {
      data: {
        title: "Súper Projecte de Prova",
        contributors: [],
        time_duration: "2 setmanes",
        language_frontend: "react",
        language_backend: "node",
      },
    };

    (useCodeConnectDetails as Mock).mockReturnValue({
      codeConnectProject: mockProjectData,
      isLoading: false,
    });

    render(<CodeConnectDetails />);

    expect(screen.getByText("Súper Projecte de Prova")).toBeTruthy();

    expect(screen.getByTestId("mock-project-team")).toBeTruthy();

    expect(screen.getByText("Roadmap")).toBeTruthy();
  });
});
