import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LeagueNotificationModal } from "./LeagueNotificationModal";

describe("LeagueNotificationModal", () => {
  it("renders correctly and calls onDismiss on click", () => {
    const handleDismiss = vi.fn();
    render(
      <LeagueNotificationModal
        direction="up"
        leagueName="Silver"
        onDismiss={handleDismiss}
      />,
    );

    expect(screen.getByText("Felicitats!")).toBeInTheDocument();
    expect(screen.getByText("Silver")).toBeInTheDocument();
    expect(
      screen.getByText(/El teu esforç ha donat fruits!/i),
    ).toBeInTheDocument();

    const button = screen.getByText("D'acord");
    fireEvent.click(button);

    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
