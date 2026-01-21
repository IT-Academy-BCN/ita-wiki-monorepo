import { render, screen } from "@testing-library/react";
import { FavoriteResource } from "../FavoriteResource";

describe("FavoriteResource Component", () => {
  it("The component must have the initial styles", () => {
    render(<FavoriteResource favorite={false} />);
    const favoriteResource = screen.getByTestId("favorite-resource");
    expect(favoriteResource).toHaveClass("inline-flex");
  });
});
