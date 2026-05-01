import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IntCodeConnect } from "../../types";
import {
  CodeConnectError,
  createCodeConnect,
  fetchCodeConnectAllProjects,
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

let mockFetch: ReturnType<typeof vi.fn>;

describe("createCodeConnect", () => {
  const mockNewCodeConnect: Omit<IntCodeConnect, "time" | "unitTime"> = {
    title: "Lorem ipsum",
    language_frontend: "React",
    language_backend: "Node",
    description: "Some random text to describe lorem ipsum",
    programming_role: "Frontend",
    dev_front_number: 3,
    dev_back_number: 10,
    time_duration: "2 months",
    limit_date_inscription: "2026-12-31",
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
      "http://localhost:8000/codeconnect/create",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: expect.stringContaining("Bearer "),
        }),
        body: JSON.stringify(mockNewCodeConnect),
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

  it("should throw an error with ABORTED code when the request is aborted", async () => {
    const abortError = new DOMException("Aborted", "AbortError");
    mockFetch.mockRejectedValueOnce(abortError);

    await expect(createCodeConnect(mockNewCodeConnect)).rejects.toMatchObject({
      message: "Petició cancel·lada.",
      code: "ABORTED",
    } as CodeConnectError);
  });

  it("should throw an error on network failure", async () => {
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

  it("should call the correct endpoint and return the data", async () => {
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

  it("should throw an error with ABORTED code when the request is aborted", async () => {
    const abortError = new DOMException("Aborted", "AbortError");
    mockFetch.mockRejectedValueOnce(abortError);

    await expect(fetchCodeConnectAllProjects()).rejects.toMatchObject({
      message: "Petició cancel·lada.",
      code: "ABORTED",
    } as CodeConnectError);
  });

  it("should throw an error on network failure", async () => {
    mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    await expect(fetchCodeConnectAllProjects()).rejects.toMatchObject({
      message: "Error de connexió. Verifica la teva connexió a internet.",
      code: "NETWORK_ERROR",
    } as CodeConnectError);
  });
});
