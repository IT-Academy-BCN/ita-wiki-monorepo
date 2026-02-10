import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createCodeConnect,
  fetchCodeConnectAllProjects,
  fetchCodeConnectProjectDetails,
} from "../endPointCodeConnect";
import type { IntCodeConnect } from "../../types";
import { CodeConnectError } from "../../types/CodeConnectProjectTypes";

vi.mock("../../config", () => ({
  API_URL: "https://localhost",
  END_POINTS: {
    codeconnect: {
      post: "/codeconnect/create",
      get: "/codeconnect",
    },
  },
}));

describe("endPointCodeConnect", () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  const mockNewCodeConnect: IntCodeConnect = {
    title: "Lorem ipsum",
    techsFront: ["React", "Angular"],
    techsBack: ["Spring", "Node", "Express"],
    description: "Some random text to describe lorem ipsum",
    numberDevsFront: 3,
    numberDevsBack: 10,
    time: 1,
    unitTime: "month",
    deadline: "2026-01-01",
  };

  beforeEach(() => {
    mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("createCodeConnect", () => {
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
        "https://localhost/codeconnect/create",
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

      await expect(createCodeConnect(mockNewCodeConnect)).rejects.toMatchObject(
        {
          message: "Invalid code format",
          status: 400,
          code: "INVALID_FORMAT",
        } as CodeConnectError,
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should throw an error on network failure", async () => {
      mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

      await expect(createCodeConnect(mockNewCodeConnect)).rejects.toMatchObject(
        {
          message: "Error de connexió. Verifica la teva connexió a internet.",
          code: "NETWORK_ERROR",
        } as CodeConnectError,
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should throw ABORTED on AbortError", async () => {
      mockFetch.mockRejectedValueOnce(
        new DOMException("Aborted", "AbortError"),
      );

      await expect(createCodeConnect(mockNewCodeConnect)).rejects.toMatchObject(
        {
          message: "Petició cancel·lada",
          code: "ABORTED",
        } as CodeConnectError,
      );
    });

    it("should use fallback message when response.json fails on error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      await expect(createCodeConnect(mockNewCodeConnect)).rejects.toMatchObject(
        {
          message: "Error 500: Internal Server Error",
          status: 500,
          code: undefined,
        } as CodeConnectError,
      );
    });
  });

  describe("fetchCodeConnectAllProjects", () => {
    it("should call the correct endpoint and return data", async () => {
      const mockData = [{ id: 1, title: "Projecte Test" }];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchCodeConnectAllProjects();

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://localhost/codeconnect",
        expect.objectContaining({
          method: "GET",
          headers: { Accept: "application/json" },
          signal: undefined,
        }),
      );
    });

    it("should throw an error object when response is not ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        json: async () => ({ message: "No access", code: "FORBIDDEN" }),
      });

      await expect(fetchCodeConnectAllProjects()).rejects.toMatchObject({
        message: "No access",
        status: 403,
        code: "FORBIDDEN",
      } as CodeConnectError);
    });

    it("should throw NETWORK_ERROR on TypeError", async () => {
      mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

      await expect(fetchCodeConnectAllProjects()).rejects.toMatchObject({
        message: "Error de connexió. Verifica la teva connexió a internet.",
        code: "NETWORK_ERROR",
      } as CodeConnectError);
    });

    it("should throw ABORTED on AbortError", async () => {
      mockFetch.mockRejectedValueOnce(
        new DOMException("Aborted", "AbortError"),
      );

      await expect(fetchCodeConnectAllProjects()).rejects.toMatchObject({
        message: "Petició cancel·lada",
        code: "ABORTED",
      } as CodeConnectError);
    });
  });

  describe("fetchCodeConnectProjectDetails", () => {
    it("crida a l'endpoint correcte i retorna les dades", async () => {
      const mockData = { id: 1, title: "Projecte Test" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await fetchCodeConnectProjectDetails(1);

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://localhost/codeconnect/1",
        expect.objectContaining({
          method: "GET",
          headers: { Accept: "application/json" },
          signal: undefined,
        }),
      );
    });

    it("should throw an error object when response is not ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "Missing", code: "NOT_FOUND" }),
      });

      await expect(fetchCodeConnectProjectDetails(1)).rejects.toMatchObject({
        message: "Missing",
        status: 404,
        code: "NOT_FOUND",
      } as CodeConnectError);
    });

    it("should throw NETWORK_ERROR on TypeError", async () => {
      mockFetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));

      await expect(fetchCodeConnectProjectDetails(1)).rejects.toMatchObject({
        message: "Error de connexió. Verifica la teva connexió a internet.",
        code: "NETWORK_ERROR",
      } as CodeConnectError);
    });

    it("should throw ABORTED on AbortError", async () => {
      mockFetch.mockRejectedValueOnce(
        new DOMException("Aborted", "AbortError"),
      );

      await expect(fetchCodeConnectProjectDetails(1)).rejects.toMatchObject({
        message: "Petició cancel·lada",
        code: "ABORTED",
      } as CodeConnectError);
    });
  });
});
