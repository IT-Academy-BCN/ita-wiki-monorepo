import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { BrowserRouter } from "react-router";

import TicketingPage from "../TicketingPage";

describe("TicketingPage", () => {
  test("renders without errors", () => {
    expect(() => {
      render(
        <BrowserRouter>
          <TicketingPage />
        </BrowserRouter>,
      );
    }).not.toThrow();
  });
});
