import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IntCodeConnect } from "../types";
import {
  CodeConnectError,
  createCodeConnect,
  fetchCodeConnectAllProjects,
  fetchCodeConnectProject,
} from "./endPointCodeConnect";

vi.mock("../config", () => ({
  API_URL: "https://localhost:8000",
  END_POINTS: {
    codeconnect: {
      post: "/codeconnect/create",
    },
  },
}));

let mockFetch: ReturnType<typeof vi.fn>;

describe("createCodeConnect", () => {
  const mockNewCodeConnect: IntCodeConnect = {
    title: "Lorem ipsum",
    techsFront: ["React", "Angular"],
    techsBack: ["Spring", "Node", "Express"],
    description: "Some random text to describe lorem ipsum",
    numberDevsFront: 3,
    numberDevsBack: 10,
    time: 1,
    unitTime: "weeks",
    deadline: "",
  };

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
        headers: { "Content-Type": "application/json" },
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

    await expect(createCodeConnect(mockNewCodeConnect)).rejects.toMatchObject({
      message: "Invalid code format",
      status: 400,
      code: "INVALID_FORMAT",
    } as CodeConnectError);

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should throw an error on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

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

describe("fetchCodeConnectAllProjects", () => {
  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockClear();
  });

  it("should return all the projects from the backend", async () => {
    const mockData = [
      { id: 1, title: "Projecte Test" },
      { id: 2, title: "Projecte Test 2" },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchCodeConnectAllProjects();
    expect(result).toEqual(mockData);
  });

  it("should throw an error on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(fetchCodeConnectAllProjects()).rejects.toMatchObject({
      message: "Error de connexió. Verifica la teva connexió a internet.",
      code: "NETWORK_ERROR",
    } as CodeConnectError);
  });
});
