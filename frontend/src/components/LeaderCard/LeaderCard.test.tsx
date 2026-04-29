import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import LeaderCard, { type LeaderCardPlayer } from "./LeaderCard";

const mockPlayer: LeaderCardPlayer = {
  user_id: 101,
  username: "Developer_134",
  avatarUrl: "https://example.com/avatar.jpg",
  title: "Expert Hacker",
  points: 94,
};

describe("LeaderCard accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <LeaderCard player={mockPlayer} cupType="gold" />,
    );
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
