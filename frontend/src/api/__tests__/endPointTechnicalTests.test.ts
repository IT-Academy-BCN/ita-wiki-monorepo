import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
vi.unmock("./endPointTechnicalTests");
import { fetchTechnicalTests, createTechnicalTest } from "../endPointTechnicalTests";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

describe("fetchTechnicalTests", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchMock.mockReset();
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should return the data correctly if the API returns a direct array", async () => {
    const mockData = [{ id: 1, title: "Test A" }];

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchTechnicalTests();

    expect(result).toEqual(mockData);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should return "data.data" if the API returns a wrapped object', async () => {
    const mockInnerData = [{ id: 2, title: "Test B" }];

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockInnerData }),
    });

    const result = await fetchTechnicalTests();

    expect(result).toEqual(mockInnerData);
  });

  it("should make a console.error if the response is not OK", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Server Error",
    });

    const result = await fetchTechnicalTests();

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("should handle network errors (fetch throw)", async () => {
    const networkError = new Error("Network Error");
    fetchMock.mockRejectedValue(networkError);

    await fetchTechnicalTests();

    expect(consoleSpy).toHaveBeenCalledWith(networkError);
  });
});

describe("createTechnicalTest", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchMock.mockReset();
    localStorage.clear();
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it("should return data when API responds with ok: true", async () => {
    // Simula uma resposta bem-sucedida do backend
    const mockResponse = { id: 1, title: "Novo teste" };

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const formData = new FormData();
    formData.append("title", "Novo teste");

    const result = await createTechnicalTest(formData);

    expect(result).toEqual(mockResponse);
  });

  it("should send Authorization header with token from localStorage", async () => {
    // Guarda um token falso no localStorage (simula utilizador autenticado)
    localStorage.setItem("auth_token", "fake-token-123");

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    const formData = new FormData();
    await createTechnicalTest(formData);

    // Verifica que o fetch foi chamado com o header correto
    const calledWithOptions = fetchMock.mock.calls[0][1];
    expect(calledWithOptions.headers.Authorization).toBe(
      "Bearer fake-token-123",
    );
  });

  it("should throw an error when API responds with ok: false", async () => {
    // Simula resposta de erro do backend com mensagem
    fetchMock.mockResolvedValue({
      ok: false,
      status: 422,
      statusText: "Unprocessable Entity",
      json: async () => ({ message: "O título é obrigatório" }),
    });

    const formData = new FormData();

    // Verifica que a função lança um erro com a mensagem do backend
    await expect(createTechnicalTest(formData)).rejects.toThrow(
      "O título é obrigatório",
    );
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("should throw a generic error when API error has no message", async () => {
    // Simula resposta de erro sem mensagem — usa o status como fallback
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({}),
    });

    const formData = new FormData();

    await expect(createTechnicalTest(formData)).rejects.toThrow(
      "Error 500: Internal Server Error",
    );
  });

  it("should throw and log error on network failure", async () => {
    // Simula falha de rede (fetch lança exceção)
    const networkError = new Error("Network Error");
    fetchMock.mockRejectedValue(networkError);

    const formData = new FormData();

    await expect(createTechnicalTest(formData)).rejects.toThrow("Network Error");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error al crear prueba técnica:",
      networkError,
    );
  });
});
