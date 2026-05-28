import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AddLeaguePoints } from "../AddLeaguePoints/AddLeaguePoints";

describe("AddLeaguePoints", () => {
  it("shows a button for each scoring activity", () => {
    render(
      <AddLeaguePoints
        users={[
          {
            user_id: 1,
            username: "Jordi",
          },
        ]}
        onPointAdded={() => {}}
      />,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });
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
        onPointAdded={() => {}}
      />,
    );

    const select = screen.getByRole("combobox");
    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });

    await user.selectOptions(select, "1");
    expect(select).toHaveValue("1");

    buttons.forEach((button) => {
      expect(button).toBeEnabled();
    });
  });
});
