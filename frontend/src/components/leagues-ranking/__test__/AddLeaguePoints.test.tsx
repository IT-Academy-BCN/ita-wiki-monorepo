import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AddLeaguePoints } from "../AddLeaguePoints/AddLeaguePoints";

describe("AddLeaguePoints", () => {
  it("enables the submit button when a username is selected", async () => {
    const user = userEvent.setup();

    render(
      <AddLeaguePoints
        users={[
          {
            user_id: 1,
            username: "Jordi",
          },
        ]}
      />,
    );

    const select = screen.getByRole("combobox");
    const button = screen.getByRole("button", { name: "Sumar punts" });

    expect(button).toBeDisabled();

    await user.selectOptions(select, "1");

    expect(select).toHaveValue("1");
    expect(button).toBeEnabled();
  });
});
