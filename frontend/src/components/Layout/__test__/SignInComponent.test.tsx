import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignInComponent } from "../header/SignInComponent";

const mockSignIn = vi.fn();
const mockSetIsModalOpen = vi.fn();

vi.mock("../../../context/UserContext", () => ({
  useUserContext: () => ({
    signIn: mockSignIn,
  }),
}));

vi.mock("../../github-login/GitHubLogin", () => ({
  default: ({
    onClick,
    isLoading,
  }: {
    onClick?: () => void;
    isLoading?: boolean;
  }) => (
    <button onClick={onClick} data-loading={isLoading ? "true" : "false"}>
      GitHub Login
    </button>
  ),
}));

describe("SignInComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an error if terms are not checked", async () => {
    render(<SignInComponent setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.click(screen.getByRole("button", { name: /github login/i }));

    expect(mockSignIn).not.toHaveBeenCalled();
    expect(
      screen.getByText(/no s'ha pogut iniciar sessió/i),
    ).toBeInTheDocument();
  });

  it("calls signIn when terms are checked and close the modal", async () => {
    render(<SignInComponent setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /github login/i }));

    await waitFor(() => expect(mockSignIn).toHaveBeenCalledTimes(1));
    expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
  });

  it("shows the legal terms modal modal when clicking on the legal terms button", async () => {
    render(<SignInComponent setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.click(screen.getByRole("button", { name: /els termes legals/i }));

    expect(screen.getByText(/Termes i Condicions d'Ús/i)).toBeInTheDocument();
  });
});
