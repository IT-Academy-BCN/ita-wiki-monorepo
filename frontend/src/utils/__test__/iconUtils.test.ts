import { describe, it, expect } from "vitest";
import { displayLanguageIcon } from "../iconUtils";

describe("displayLanguageIcon", () => {
  it("retorna una icona per als llenguatges suportats", () => {

    const reactIcon = displayLanguageIcon("React");
    const javaIcon = displayLanguageIcon("Java");

    expect(reactIcon).toBeTruthy();
    expect(javaIcon).toBeTruthy();

    expect(reactIcon).not.toBe(javaIcon);
  });

  it("ignora les majúscules i minúscules", () => {
    expect(displayLanguageIcon("JAVA")).toBe(displayLanguageIcon("java"));
  });

  it("retorna string buit si no troba el llenguatge", () => {
    expect(displayLanguageIcon("LlenguatgeInventat")).toBe("");
    expect(displayLanguageIcon(null)).toBe("");
    expect(displayLanguageIcon(undefined)).toBe("");
  });
});