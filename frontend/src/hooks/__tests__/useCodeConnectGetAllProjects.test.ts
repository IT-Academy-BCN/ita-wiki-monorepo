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

  it("returns projects when API success=true and no filter is provided", async () => {
    const projects: ApiProjectData[] = [
      makeProject(),
      makeProject({ id: 2, title: "Projecte 2" }),
    ];

    const response: ApiProjectsResponse = {
      success: true,
      message: "ok",
      data: projects,
    };

    vi.mocked(fetchCodeConnectAllProjects).mockResolvedValueOnce(response);

    const { result } = renderHook(() => useProjects(null));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBeNull();
    expect(result.current.projects).toEqual(projects);
    expect(fetchCodeConnectAllProjects).toHaveBeenCalledTimes(1);
  });

  it("filters projects by frontend/backend language (trim + lowercase)", async () => {
    const projects: ApiProjectData[] = [
      makeProject({
        id: 1,
        language_frontend: "React",
        language_backend: "PHP",
      }),
      makeProject({
        id: 2,
        language_frontend: "Angular",
        language_backend: "Java",
      }),
      makeProject({
        id: 3,
        language_frontend: "Vue",
        language_backend: "Node",
      }),
    ];

    const response: ApiProjectsResponse = {
      success: true,
      message: "ok",
      data: projects,
    };

    vi.mocked(fetchCodeConnectAllProjects).mockResolvedValueOnce(response);

    const { result } = renderHook(() => useProjects("  react  "));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBeNull();
    expect(result.current.projects.map((project) => project.id)).toEqual([1]);
  });

  it("sets errorMessage when API success=false", async () => {
    const response: ApiProjectsResponse = {
      success: false,
      message: "KO",
      data: [],
    };

    vi.mocked(fetchCodeConnectAllProjects).mockResolvedValueOnce(response);

    const { result } = renderHook(() => useProjects(null));

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

    const { result } = renderHook(() => useProjects(null));

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

    const { result } = renderHook(() => useProjects(null));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.projects).toEqual([]);
    expect(result.current.errorMessage).toBe("Network down");
  });

  it("ignores AbortError and does not set errorMessage", async () => {
    const abortError: unknown = { name: "AbortError" };

    vi.mocked(fetchCodeConnectAllProjects).mockRejectedValueOnce(abortError);

    const { result } = renderHook(() => useProjects(null));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.errorMessage).toBeNull();
    expect(result.current.projects).toEqual([]);
  });
});
