import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCodeConnectProjectDetails } from "../useCodeConnectProjectDetails";
import { fetchCodeConnectProjectDetails } from "../../api/endPointCodeConnect";
import type {
  CodeConnectProject,
  CodeConnectProjectDetailsResponse,
} from "../../types/CodeConnectProjectTypes";

vi.mock("../../api/endPointCodeConnect", () => ({
  fetchCodeConnectProjectDetails: vi.fn(),
}));

const makeProject = (
  overrides: Partial<CodeConnectProject> = {},
): CodeConnectProject => {
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

describe("useCodeConnectProjectDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not call fetch when projectId is null", async () => {
    const { result } = renderHook(() => useCodeConnectProjectDetails(null));

    // no hi ha fetch, isLoading continua false i no hi ha error
    expect(result.current.isLoading).toBe(false);
    expect(result.current.codeConnectProject).toBeNull();
    expect(result.current.errorMessage).toBeNull();

    expect(fetchCodeConnectProjectDetails).not.toHaveBeenCalled();
  });

  it("sets error when projectId is not a number", async () => {
    const { result } = renderHook(() =>
      useCodeConnectProjectDetails("not-a-number"),
    );

    await waitFor(() => {
      expect(result.current.errorMessage).toBe("Invalid project id");
    });

    expect(result.current.codeConnectProject).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(fetchCodeConnectProjectDetails).not.toHaveBeenCalled();
  });

  it("returns project details when API response is valid and success=true", async () => {
    const response: CodeConnectProjectDetailsResponse = {
      success: true,
      message: "ok",
      data: makeProject({ title: "Projecte Vitest" }),
    };

    vi.mocked(fetchCodeConnectProjectDetails).mockResolvedValueOnce(response);

    const { result } = renderHook(() => useCodeConnectProjectDetails("1"));

    await waitFor(() => {
      expect(result.current.codeConnectProject).toEqual(response);
    });

    expect(result.current.errorMessage).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(fetchCodeConnectProjectDetails).toHaveBeenCalledWith(1);
  });

  it("sets error when API returns success=false", async () => {
    const response: CodeConnectProjectDetailsResponse = {
      success: false,
      message: "KO",
      data: makeProject(),
    };

    vi.mocked(fetchCodeConnectProjectDetails).mockResolvedValueOnce(response);

    const { result } = renderHook(() => useCodeConnectProjectDetails("1"));

    await waitFor(() => {
      expect(result.current.errorMessage).toBe("KO");
    });

    expect(result.current.codeConnectProject).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("sets error when API response shape is invalid", async () => {
    const invalidResponse: unknown = { foo: "bar" };

    vi.mocked(fetchCodeConnectProjectDetails).mockResolvedValueOnce(
      invalidResponse,
    );

    const { result } = renderHook(() => useCodeConnectProjectDetails("1"));

    await waitFor(() => {
      expect(result.current.errorMessage).toBe("Invalid API response shape");
    });

    expect(result.current.codeConnectProject).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("sets errorMessage on thrown Error and resets loading", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.mocked(fetchCodeConnectProjectDetails).mockRejectedValueOnce(
      new Error("Network down"),
    );

    const { result } = renderHook(() => useCodeConnectProjectDetails("1"));

    await waitFor(() => {
      expect(result.current.errorMessage).toBe("Network down");
    });

    expect(result.current.codeConnectProject).toBeNull();
    expect(result.current.isLoading).toBe(false);

    consoleErrorSpy.mockRestore();
  });
});
