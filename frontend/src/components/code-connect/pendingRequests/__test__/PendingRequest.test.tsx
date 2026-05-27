// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PendingRequest from "../PendingRequest";
import type { ApiContributor } from "../../../../types/codeConnectTypes";

const contributor: ApiContributor = {
  id: 1,
  user_id: 200,
  programming_role: "Frontend Developer",
  status: "pending",
  user: { id: 200, name: "userTest", email: "usertest@test.com" },
};

describe("PendingRequest", () => {
  it("renders the contributor username", () => {
    render(
      <ul>
        <PendingRequest contributor={contributor} />
      </ul>,
    );
    expect(screen.getByText("userTest")).toBeTruthy();
  });

  it("renders the role icon when provided", () => {
    render(
      <ul>
        <PendingRequest contributor={contributor} roleIcon="/react-logo.svg" />
      </ul>,
    );
    expect(screen.getByAltText("Frontend Developer")).toBeTruthy();
  });

  it("does not render a role icon when roleIcon is not provided", () => {
    render(
      <ul>
        <PendingRequest contributor={contributor} />
      </ul>,
    );
    expect(screen.queryByAltText("Frontend Developer")).toBeNull();
  });
});
