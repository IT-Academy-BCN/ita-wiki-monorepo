// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TeamRow from "../TeamRow";

describe("TeamRow Component", () => {
  it("renderitza els membres i els espais buits", () => {
    const members = [{ name: "Test User", avatar: "fake.png" }];
    const slots = 2;

    render(<TeamRow members={members} emptySlots={slots} />);

    expect(screen.getByText("Test User")).toBeTruthy();

    expect(screen.getAllByText("+")).toHaveLength(2);
  });
});
