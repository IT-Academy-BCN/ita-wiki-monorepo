import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CategoryIcon from "../CategoryIcon";
import { TicketCategoryEnum } from "../../../types/ticketingTypes";
describe("CategoryIcon", () => {
  it("renders error icon for bug category", () => {
    render(<CategoryIcon category={TicketCategoryEnum.BUG} />);
    const img = document.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.alt).toBe("bug");
  });
  it("renders suggestion icon", () => {
    render(<CategoryIcon category={TicketCategoryEnum.SUGGESTION} />);
    const img = document.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.alt).toBe("suggestion");
  });
  it("renders other icon", () => {
    render(<CategoryIcon category={TicketCategoryEnum.OTHER} />);
    const img = document.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.alt).toBe("other");
  });
});
