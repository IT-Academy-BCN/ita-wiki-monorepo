import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { updateContributorStatus } from "../../../../api/endPointContributors";
import { AcceptButton } from "../AcceptButton";

vi.mock("../../../../api/endPointContributors", () => ({
  updateContributorStatus: vi.fn(),
}));

describe("AcceptButton", () => {
  it("calls updateContributorStatus with the status accepted on click", async () => {
    render(<AcceptButton projectId={1} contributorId={1} />);
    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: "Acceptar" });
    await user.click(button);
    expect(updateContributorStatus).toHaveBeenCalledWith(1, 1, "accepted");
  });
});
