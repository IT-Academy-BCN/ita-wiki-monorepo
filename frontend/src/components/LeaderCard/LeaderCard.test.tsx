import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LeaderCard, { type LeaderCardPlayer } from "./LeaderCard";

const mockPlayer: LeaderCardPlayer = {
  user_id: 101,
  username: "Developer_134",
  avatarUrl: "https://example.com/avatar.jpg",
  title: "Expert Hacker",
  points: 94,
};

describe("LeaderCard", () => {
  it("renders username and points", () => {
    render(<LeaderCard player={mockPlayer} cupType="gold" />);
    expect(screen.getByText("Developer_134")).toBeInTheDocument();
    expect(screen.getByText("94")).toBeInTheDocument();
  });

  it("renders the correct cup icon", () => {
    render(<LeaderCard player={mockPlayer} cupType="silver" />);
    expect(screen.getByLabelText("silver cup")).toBeInTheDocument();
  });

  it("shows initials when avatar fails to load", () => {
    render(<LeaderCard player={mockPlayer} cupType="gold" />);
    fireEvent.error(screen.getByAltText("Developer_134 avatar"));
    expect(screen.getByText("DE")).toBeInTheDocument();
  });
});
