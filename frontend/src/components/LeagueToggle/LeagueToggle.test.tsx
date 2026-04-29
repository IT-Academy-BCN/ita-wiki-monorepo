import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import LeagueToggle from "./LeagueToggle";

describe("LeagueToggle accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<LeagueToggle view="weekly" onChange={vi.fn()} />);
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
