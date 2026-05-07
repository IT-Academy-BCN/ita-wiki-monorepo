import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrowserRouter } from "react-router";

import TicketingPage from "../TicketingPage";

describe("TicketingPage", () => {
  it("renders without errors", () => {
    expect(() => {
      render(
        <BrowserRouter>
          <TicketingPage />
        </BrowserRouter>,
      );
    }).not.toThrow();
  });

  it("renders ticketing create form", () => {
    render(
      <BrowserRouter>
        <TicketingPage />
      </BrowserRouter>,
    );

    expect(screen.getByRole("button", { name: "Crear ticket" })).toBeTruthy();
  });
});
