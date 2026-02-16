import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createCodeConnect,
  CodeConnectError,
  fetchCodeConnectProject,
} from "./endPointCodeConnect";
import type { CreateCodeConnectPayload } from "../types/CodeConnectProject";

vi.mock("../config", () => ({
  API_URL: "https://localhost:8000",
  END_POINTS: {
    codeconnect: {
      post: "/codeconnect/create",
      get: "/codeconnect",
    },
  },
}));

describe("createCodeConnect", () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create and return on successful request", async () => {
    const mockResponseData = {
      id: "123",
      message: "Code connect created successfully",
      status: "success",
    };

    const mockNewCodeConnect: CreateCodeConnectPayload = {
      title: "Lorem ipsum",
      time_duration: "2 months",
      language_backend: "PHP",
      language_frontend: "React",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponseData),
    });

    const result = await createCodeConnect(mockNewCodeConnect);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      "https://localhost:8000/codeconnect/create",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Accept: "application/json",
        }),
        body: JSON.stringify(mockNewCodeConnect),
        signal: undefined,
      }),
    );

    expect(result).toEqual(mockResponseData);
  });

  it("should throw an error on failed request", async () => {
    const mockErrorData = {
      message: "Invalid code format",
      code: "INVALID_FORMAT",
    };

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: async () => mockErrorData,
    });

    const mockNewCodeConnect: CreateCodeConnectPayload = {
      title: "Lorem ipsum",
      time_duration: "2 months",
      language_backend: "PHP",
      language_frontend: "React",
    };

    await expect(createCodeConnect(mockNewCodeConnect)).rejects.toMatchObject({
      message: "Invalid code format",
      status: 400,
      code: "INVALID_FORMAT",
    } as CodeConnectError);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should throw an error on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    const mockNewCodeConnect: CreateCodeConnectPayload = {
      title: "Lorem ipsum",
      time_duration: "2 months",
      language_backend: "PHP",
      language_frontend: "React",
    };

    await expect(createCodeConnect(mockNewCodeConnect)).rejects.toMatchObject({
      message: "Error de conexión. Verifica tu conexión a internet.",
      code: "NETWORK_ERROR",
    } as CodeConnectError);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

describe("fetchCodeConnectProject", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("crida a l'endpoint correcte i retorna les dades", async () => {
    const mockData = { id: 1, title: "Projecte Test" };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchCodeConnectProject(1);

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/1"));
  });
});
