import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  createCodeConnect,
  type CodeConnectError,
  fetchCodeConnectProject,
} from "../endPointCodeConnect";

vi.mock("../../config", () => ({
  API_URL: "http://localhost:8000",
  END_POINTS: {
    codeconnect: {
      post: "/codeconnect/create",
      get: "/codeconnect",
    },
  },
}));

describe("createCodeConnect", () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  const mockNewCodeConnect = {
    title: "Lorem ipsum",
    techsFront: ["React", "Angular"],
    techsBack: ["Spring", "Node", "Express"],
    description: "Some random text to describe lorem ipsum",
    numberDevsFront: 3,
    numberDevsBack: 10,
    time: 2,
    unitTime: "months",
    deadline: "2026-12-31",
  };

  beforeEach(() => {
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should create and return on successful request", async () => {
    const mockResponseData = {
      id: "123",
      message: "Code connect created successfully",
      status: "success",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponseData),
    });

    const result = await createCodeConnect(mockNewCodeConnect);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8000/codeconnect/create",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockNewCodeConnect),
        signal: undefined,
      }),
    );

    expect(result).toEqual(mockResponseData);
  });

  test("should throw an error on failed request", async () => {
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

    await expect(createCodeConnect(mockNewCodeConnect)).rejects.toMatchObject({
      message: "Invalid code format",
      status: 400,
      code: "INVALID_FORMAT",
    } as CodeConnectError);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test("should throw an error on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(createCodeConnect(mockNewCodeConnect)).rejects.toMatchObject({
      message: "Error de connexió. Verifica la teva connexió a internet.",
      code: "NETWORK_ERROR",
    } as CodeConnectError);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

describe("fetchCodeConnectProject", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("crida a l'endpoint correcte i retorna les dades", async () => {
    const mockData = {
      success: true,
      message: "Project retrieved successfully",
      data: {
        title: "Projecte Test",
        description: "",
        roadmap: "",
        time_duration: "1 month",
        language_backend: "PHP",
        language_frontend: "JavaScript",
        contributors: [],
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchCodeConnectProject(1);

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8000/codeconnect/1",
    );
  });
});
