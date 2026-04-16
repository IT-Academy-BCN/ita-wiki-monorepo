import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IntResource } from "../types";
import { getResources } from "./endPointResources";

type MinimalResource = Pick<IntResource, "id" | "title" | "type">;

const mockResources: MinimalResource[] = [
  { id: 1, title: "Recurso 1", type: "Video" },
  { id: 2, title: "Recurso 2", type: "Blog" },
];

describe("getResources", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("debería lanzar un error si fetch falla", async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error("Error al obtener los recursos")),
    );

    await expect(getResources()).rejects.toThrow(
      "Error al obtener los recursos",
    );
  });

  it("debería devolver una lista de recursos vacía si la API responde correctamente pero sin datos", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response),
    );

    const resources = await getResources();
    expect(resources).toBeInstanceOf(Array);
    expect(resources).toHaveLength(0);
  });

  it("debería devolver los datos de la API cuando la respuesta es exitosa", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResources),
      } as Response),
    );

    const resources = await getResources();

    expect(resources).toEqual(mockResources);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("resources"),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("debería lanzar error si la API devuelve un error HTTP", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response),
    );

    await expect(getResources()).rejects.toThrow(
      "Error al obtener los recursos",
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
