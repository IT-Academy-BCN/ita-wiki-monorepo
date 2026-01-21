import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TermsAndConditionsModal } from "./TermsAndConditionsModal";

//Mock TermsAndConditionsComponent
vi.mock("../Layout/header/TermsAndConditionsComponent", () => ({
  default: ({ closeModal }: { closeModal: () => void }) => (
    <button onClick={closeModal}>Mocked Component</button>
  ),
}));

describe("TermsAndConditionsModal", () => {
  const mockCloseModal = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the modal with the provided title", () => {
    render(
      <TermsAndConditionsModal
        closeModal={mockCloseModal}
        title="Test Title"
      />,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("calls closeModal when clicking the button", () => {
    render(<TermsAndConditionsModal closeModal={mockCloseModal} />);

    const backdrop = screen.getByRole("button");
    fireEvent.click(backdrop);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });
});
