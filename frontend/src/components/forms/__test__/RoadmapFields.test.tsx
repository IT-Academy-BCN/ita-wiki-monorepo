import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RoadmapField } from "../RoadmapField";

const mocksetRoadmap = vi.fn();
beforeEach(() => mocksetRoadmap.mockClear());

describe("Roadmap field", () => {
  it("renders the add step button", () => {
    render(<RoadmapField setRoadmap={mocksetRoadmap} />);
    expect(screen.getByText("Roadmap")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Afegir una etapa/i }),
    ).toBeInTheDocument();
  });
  it("renders the add step input on button click", async () => {
    const user = userEvent.setup();
    render(<RoadmapField setRoadmap={mocksetRoadmap} />);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
  it("adds or edit a task on input change", async () => {
    const user = userEvent.setup();
    render(<RoadmapField setRoadmap={mocksetRoadmap} />);
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("textbox"), "Test step");
    expect(mocksetRoadmap).toHaveBeenCalled();
  });
  it("shows the remove button for each task", async () => {
    const user = userEvent.setup();
    render(<RoadmapField setRoadmap={mocksetRoadmap} />);
    await user.click(screen.getByRole("button"));
    expect(
      screen.getByRole("button", { name: /Eliminar etapa/i }),
    ).toBeInTheDocument();
    await user.type(screen.getByRole("textbox"), "Test step");
    await user.click(screen.getByRole("button", { name: /Afegir una etapa/i }));
    expect(
      screen.getAllByRole("button", { name: /Eliminar etapa/i }),
    ).toHaveLength(2);
  });
  it("removes a task on button click", async () => {
    const user = userEvent.setup();
    render(<RoadmapField setRoadmap={mocksetRoadmap} />);
    await user.click(screen.getByRole("button"));
    await user.type(screen.getByRole("textbox"), "Test step");
    await user.click(screen.getByRole("button", { name: /Eliminar etapa/i }));
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
  });
});
