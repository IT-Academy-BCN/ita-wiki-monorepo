import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ResourceCard from "../../ui/ResourceCard";
import { IntResource } from "../../../types";
import { UserProvider } from "../../../context/UserContext";

vi.mock("../../utils/iconUtils", () => ({
  displayLanguageIcon: () => "mock-icon.png",
}));

vi.mock("../../data/permission/tempRolesPremission", () => ({
  canBookmark: () => true,
}));

const mockResource: IntResource = {
  id: 1,
  github_id: 12345678,
  title: "Logic tutorial for Beginners",
  type: "Video",
  category: "Python",
  created_at: "2022-12-20",
  tags: ["Lógica", "Variables", "Fundamentos"],
  like_count: 143,
  description: "Test description",
  url: "https://test.com",
};

describe("ResourceCard", () => {
  it("ha de renderitzar el títol, els tags i el comptador de likes", () => {
    render(
      <UserProvider>
        <ResourceCard resource={mockResource} />
      </UserProvider>,
    );

    expect(screen.getByText(/Logic tutorial for Beginners/i)).toBeDefined();

    expect(screen.getByText("Lógica")).toBeDefined();
    expect(screen.getByText("Variables")).toBeDefined();

    expect(screen.getByText("143")).toBeDefined();

    expect(screen.getByText(/20 dic 2022/i)).toBeDefined();
  });
});
