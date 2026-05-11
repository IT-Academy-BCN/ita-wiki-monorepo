import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AddLeaguePoints } from "../AddLeaguePoints";

describe("AddLeaguePoints", () => {
  it("enables the submit button when a username is selected", async () => {
    const user = userEvent.setup();

    render(<AddLeaguePoints usernames={["Jordi"]} />);

    const select = screen.getByRole("combobox");
    const button = screen.getByRole("button", { name: "Sumar punts" });

    expect(button).toBeDisabled();

    await user.selectOptions(select, "Jordi");

    expect(select).toHaveValue("Jordi");
    expect(button).toBeEnabled();
  });
});
