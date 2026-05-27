import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { updateContributorStatus } from "../../../../api/endPointContributors";
import { RejectButton } from "../RejectButton";

vi.mock("../../../../api/endPointContributors", () => ({
  updateContributorStatus: vi.fn(),
}));

describe("RejectButton", () => {
  it("calls updateContributorStatus with the status rejected on click", async () => {
    render(<RejectButton project={1} contributor={1} />);
    const user = userEvent.setup();
    const button = screen.getByRole("button", { name: /rebutjar/i });
    await user.click(button);
    expect(updateContributorStatus).toHaveBeenCalledWith(1, 1, "rejected");
  });
});
