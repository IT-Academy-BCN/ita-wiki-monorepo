import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { BrowserRouter } from "react-router";

import TicketingPage from "../TicketingPage";

describe("TiketingPage", () => {
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
