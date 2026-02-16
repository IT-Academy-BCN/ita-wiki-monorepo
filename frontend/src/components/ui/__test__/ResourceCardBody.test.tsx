import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ResourceCardBody from "../ResourceCardBody";
import { Tag } from "../../../types";

vi.mock("../../resources/ContentTypeBadge", () => ({
  default: ({ type }: { type: string }) => <div data-testid="type-badge">{type}</div>,
}));

vi.mock("lucide-react", () => ({
  Calendar: () => <span data-testid="calendar-icon">Calendar</span>,
}));

vi.mock("../../../assets/heart.svg", () => ({
  default: "fake-heart-url.svg",
}));

describe("ResourceCardBody", () => {
  
  it("renders correctly with string tags", () => {
    render(
      <ResourceCardBody
        tags={["React", "Hooks"]}
        type="Blog"
        likeCount={42}
        formattedDate="10 Oct 2023"
      />
    );

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Hooks")).toBeInTheDocument();

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("10 Oct 2023")).toBeInTheDocument();
    
    expect(screen.getByTestId("type-badge")).toHaveTextContent("Blog");
  });

  it("renders correctly with object tags (Interface Tag)", () => {
    const objectTags: Tag[] = [
      { id: 1, name: "Advanced", created_at: "", updated_at: "" },
    ];

    render(
      <ResourceCardBody
        tags={objectTags}
        type="Video"
        likeCount={0}
        formattedDate="01 Jan 2024"
      />
    );

    expect(screen.getByText("Advanced")).toBeInTheDocument();
  });

  it("renders correctly without tags", () => {
    render(
      <ResourceCardBody
        type="Cursos"
        formattedDate="Now"
      />
    );

    expect(screen.getByText("Now")).toBeInTheDocument();
    
    expect(screen.getByTestId("type-badge")).toHaveTextContent("Cursos");
  });
});