import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTechnicalTest } from "../api/endPointTechnicalTests";
import { API_URL, END_POINTS } from "../config";

describe("createTechnicalTest", () => {
  const mockFormData = new FormData();
  mockFormData.append("title", "Prueba técnica test");

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("debe hacer POST al endpoint correcto y retornar respuesta exitosa", async () => {
    const mockResponseData = { message: "Guardado exitoso" };

    //@ts-expect-error: mocking FormData for test
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData,
    });

    const result = await createTechnicalTest(mockFormData);

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}${END_POINTS.technicaltests.create}`,
      expect.objectContaining({
        method: "POST",
        body: mockFormData,
      }),
    );

    expect(result).toEqual(mockResponseData);
  });

  it("debe lanzar error si la respuesta no es ok", async () => {
    // @ts-expect-error instead of using fetch.mockResolvedValueOnce, we use fetch.mockRejectedValueOnce
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Error de prueba" }),
      status: 400,
      statusText: "Bad Request",
    });

    await expect(createTechnicalTest(mockFormData)).rejects.toThrow(
      "Error de prueba",
    );
  });
});
