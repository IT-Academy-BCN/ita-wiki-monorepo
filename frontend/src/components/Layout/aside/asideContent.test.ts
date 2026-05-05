import { describe, it, expect } from "vitest";
import { AsideNavbarData } from "./asideContent";

describe("AsideNavbarData", () => {
  it("includes the Lligues link pointing to /ligas", () => {
    const lligues = AsideNavbarData.find((item) => item.label === "Lligues");
    expect(lligues).toBeDefined();
    expect(lligues?.ref).toBe("/ligas");
  });
});
