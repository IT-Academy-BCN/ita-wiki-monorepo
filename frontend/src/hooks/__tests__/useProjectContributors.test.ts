import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useProjectContributors } from "../useProjectContributors";

describe("useProjectContributors Hook", () => {
  it("filtra correctament per rol i calcula els espais buits", () => {
    const mockContributors = [
      { name: "Anna", programming_role: "Frontend Developer" }, // Hauria de sortir
      { name: "Marc", programming_role: "Backend Developer" }, // No hauria de sortir
    ];

    const { result } = renderHook(() =>
      useProjectContributors(mockContributors),
    );

    const { members, emptySlots } = result.current.getTeamByRole("frontend");

    expect(members).toHaveLength(1);
    expect(members[0].name).toBe("Anna");
    expect(members[0].avatar).toContain("ui-avatars.com");
    expect(emptySlots).toBe(2);
  });
});
