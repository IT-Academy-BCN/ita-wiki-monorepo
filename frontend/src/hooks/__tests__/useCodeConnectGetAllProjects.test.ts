import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchCodeConnectAllProjects } from "../../api/endPointCodeConnect";
import type {
  ApiProjectData,
  ApiProjectsResponse,
} from "../../types/codeConnectTypes";
import { useProjects } from "../useCodeConnectGetAllProjects";

vi.mock("../../api/endPointCodeConnect", () => ({
  fetchCodeConnectAllProjects: vi.fn(),
}));

const makeProject = (
  overrides: Partial<ApiProjectData> = {},
): ApiProjectData => {
  return {
    id: 1,
    title: "Projecte 1",
    time_duration: "1 mes",
    language_frontend: "react",
    language_backend: "java",
    contributors: [],
    ...overrides,
  };
};

describe("useProjects", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns mapped projects when API success=true", async () => {
    const apiProjects: ApiProjectData[] = [
      makeProject(),
      makeProject({ id: 2, title: "Projecte 2" }),
    ];

    const response: ApiProjectsResponse = {
      success: true,
      message: "ok",
      data: apiProjects,
    };

    vi.mocked(fetchCodeConnectAllProjects).mockResolvedValueOnce(response);
    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchCodeConnectAllProjects).toHaveBeenCalledTimes(1);
    expect(result.current.errorMessage).toBeNull();
    expect(result.current.projects).toEqual([
      {
        id: 1,
        title: "Projecte 1",
        duration: "1 mes",
        startDate: expect.any(String),
        endDate: expect.any(String),
        frontend: {
          tech: "react",
          logo: "../assets/technologies/react-logo.svg",
          positions: 2,
          participants: [],
        },
        backend: {
          tech: "java",
          logo: "../assets/technologies/java-logo.svg",
          positions: 2,
          participants: [],
        },
      },
      {
        id: 2,
        title: "Projecte 2",
        duration: "1 mes",
        startDate: expect.any(String),
        endDate: expect.any(String),
        frontend: {
          tech: "react",
          logo: "../assets/technologies/react-logo.svg",
          positions: 2,
          participants: [],
        },
        backend: {
          tech: "java",
          logo: "../assets/technologies/java-logo.svg",
          positions: 2,
          participants: [],
        },
      },
    ]);
  });

  it("sets errorMessage when API success=false", async () => {
    const response: ApiProjectsResponse = {
      success: false,
      message: "KO",
      data: [],
    };

    vi.mocked(fetchCodeConnectAllProjects).mockResolvedValueOnce(response);

    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.projects).toEqual([]);
    expect(result.current.errorMessage).toBe("KO");
  });

  it("sets errorMessage when API response shape is invalid", async () => {
    const invalidResponse: unknown = { nope: true };

    vi.mocked(fetchCodeConnectAllProjects).mockResolvedValueOnce(
      invalidResponse as ApiProjectsResponse,
    );

    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.projects).toEqual([]);
    expect(result.current.errorMessage).toBe("Invalid API response shape");
  });

  it("sets errorMessage on generic fetch error", async () => {
    vi.mocked(fetchCodeConnectAllProjects).mockRejectedValueOnce(
      new Error("Network down"),
    );

    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.projects).toEqual([]);
    expect(result.current.errorMessage).toBe("Network down");
  });

  it("ignores AbortError and does not set errorMessage", async () => {
    const abortError: unknown = { name: "AbortError" };

    vi.mocked(fetchCodeConnectAllProjects).mockRejectedValueOnce(abortError);

    const { result } = renderHook(() => useProjects());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBeNull();
    expect(result.current.projects).toEqual([]);
  });
});
