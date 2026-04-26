import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, type Mock } from "vitest";
import useCodeConnectDetails from "../useCodeConnectDetails";
import { fetchCodeConnectProject } from "../../api/endPointCodeConnect";

vi.mock("../../api/endPointCodeConnect");

describe("useCodeConnectDetails Hook", () => {
  it("returns project data and manages loading", async () => {
    const mockData = {
      success: true,
      message: "Project retrieved successfully",
      data: {
        id: 1,
        description: "Descripció de prova",
        title: "Projecte Vitest",
        roadmap: "Roadmap de prova",
        time_duration: "2 setmanes",
        language_backend: "PHP",
        language_frontend: "JavaScript",
        contributors: [],
      },
    };

    (fetchCodeConnectProject as Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useCodeConnectDetails("1"));

    await waitFor(() => {
      expect(result.current.codeConnectProject).toEqual(mockData);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBe(null);
    expect(fetchCodeConnectProject).toHaveBeenCalledWith(1);
  });

  it("return empty state when projectId is null", async () => {
    const { result } = renderHook(() => useCodeConnectDetails(null));

    await waitFor(() => {
      expect(result.current.codeConnectProject).toBe(null);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.errorMessage).toBe(null);
    expect(fetchCodeConnectProject).not.toHaveBeenCalled();
  });

  it("returns error when projectId is not numeric", async () => {
    const { result } = renderHook(() => useCodeConnectDetails("abc"));

    await waitFor(() => {
      expect(result.current.errorMessage).toBe("Invalid project id");
    });

    expect(result.current.codeConnectProject).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(fetchCodeConnectProject).not.toHaveBeenCalled();
  });

  it("return error when fetch fail", async () => {
    (fetchCodeConnectProject as Mock).mockRejectedValue(
      new Error("Error de connexió. Verifica la teva connexió a internet."),
    );

    const { result } = renderHook(() => useCodeConnectDetails("1"));

    await waitFor(() => {
      expect(result.current.errorMessage).toBe(
        "Error de connexió. Verifica la teva connexió a internet.",
      );
    });

    expect(result.current.codeConnectProject).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(fetchCodeConnectProject).toHaveBeenCalledWith(1);
  });
});
