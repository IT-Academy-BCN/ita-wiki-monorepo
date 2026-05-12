import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useProjectContributors } from "../useProjectContributors";

describe("useProjectContributors Hook", () => {
  it("filtra correctament per rol i calcula els espais buits", () => {
    const mockContributors = [
      {
        name: "Anna",
        programming_role: "Frontend Developer",
        avatar_url: null,
      }, // Hauria de sortir
      { name: "Marc", programming_role: "Backend Developer", avatar_url: null }, // No hauria de sortir
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

  it("usa avatar_url de la API cuando está disponible", () => {
    const mockContributors = [
      {
        name: "Anna",
        programming_role: "Frontend Developer",
        avatar_url: "https://avatars.githubusercontent.com/u/12345",
      },
    ];

    const { result } = renderHook(() =>
      useProjectContributors(mockContributors),
    );

    const { members } = result.current.getTeamByRole("frontend");

    expect(members[0].avatar).toBe(
      "https://avatars.githubusercontent.com/u/12345",
    );
  });

  it("usa el placeholder cuando avatar_url es null", () => {
    const mockContributors = [
      {
        name: "Anna",
        programming_role: "Frontend Developer",
        avatar_url: null,
      },
    ];

    const { result } = renderHook(() =>
      useProjectContributors(mockContributors),
    );

    const { members } = result.current.getTeamByRole("frontend");

    expect(members[0].avatar).toContain("ui-avatars.com");
  });
});
