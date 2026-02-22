import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import TechnicalTestsHeader from "../TechnicalTestsHeader";

describe("TechnicalTestsHeader", () => {
  it("renders without crashing", () => {
    render(<TechnicalTestsHeader />);
    expect(document.querySelector(".flex")).toBeInTheDocument();
  });
});
