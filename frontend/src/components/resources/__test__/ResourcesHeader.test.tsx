import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ResourcesHeader from "../ResourcesHeader";

describe("ResourcesHeader", () => {
  it("renders LanguageTagsBar", () => {
    render(<ResourcesHeader />);
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("renders sort and filter buttons", () => {
    render(<ResourcesHeader />);
    expect(screen.getByText("Ordenar")).toBeInTheDocument();
    expect(screen.getByText("Filtres")).toBeInTheDocument();
  });

  it("opens sort dropdown when clicked", () => {
    render(<ResourcesHeader />);
    fireEvent.click(screen.getByText("Ordenar"));
    expect(screen.getByText("Likes")).toBeInTheDocument();
  });

  it("opens filters dropdown when clicked", () => {
    render(<ResourcesHeader />);
    fireEvent.click(screen.getByText("Filtres"));
    expect(screen.getByText("Tipus")).toBeInTheDocument();
  });

  it("closes sort dropdown when filters is opened", () => {
    render(<ResourcesHeader />);
    fireEvent.click(screen.getByText("Ordenar"));
    expect(screen.getByText("Likes")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Filtres"));
    expect(screen.queryByText("Likes")).not.toBeInTheDocument();
    expect(screen.getByText("Tipus")).toBeInTheDocument();
  });
});
