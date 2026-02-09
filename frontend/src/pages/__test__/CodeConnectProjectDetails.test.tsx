import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CodeConnectDetails from "../CodeConnectProjectDetails";
import { useCodeConnectProjectDetails } from "../../hooks/useCodeConnectProjectDetails";

vi.mock("react-router", () => ({
  useParams: () => ({ projectId: "1" }),
}));

vi.mock("../../hooks/useCodeConnectProjectDetails", () => ({
  useCodeConnectProjectDetails: vi.fn(),
}));

vi.mock("../../components/code-connect/projectCard/ProjectCard", () => ({
  default: () => <div data-testid="mock-project-card">Mock ProjectCard</div>,
}));

describe("CodeConnectDetails Page", () => {
  it("renderitza el títol del projecte i la card quan arriben les dades", () => {
    const mockProjectData = {
      data: {
        title: "Súper Projecte de Prova",
        contributors: [],
        time_duration: "2 setmanes",
        language_frontend: "react",
        language_backend: "node",
      },
    };

    vi.mocked(useCodeConnectProjectDetails).mockReturnValue({
      codeConnectProject: mockProjectData,
      isLoading: false,
    } as never);

    render(<CodeConnectDetails />);

    expect(screen.getByText("Súper Projecte de Prova")).toBeTruthy();
    expect(screen.getByText("Roadmap")).toBeTruthy();
    expect(screen.getByTestId("mock-project-card")).toBeTruthy();
  });
});
