import { render, screen } from "@testing-library/react";
import { BodyResource } from "../BodyResource";

describe("BodyResource Component", () => {
  it("The component must have the initial styles", () => {
    render(<BodyResource>Content here</BodyResource>);
    const bodyResource = screen.getByTestId("body-resource");
    expect(bodyResource).toBeInTheDocument();
    expect(bodyResource).toHaveClass("flex gap-2 w-full justify-between p-4");
  });
});
