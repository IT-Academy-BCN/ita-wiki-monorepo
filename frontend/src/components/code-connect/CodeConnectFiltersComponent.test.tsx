import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import CodeConnectFiltersComponent from "./CodeConnectFiltersComponent";

describe("CodeConnectFiltersComponent", () => {
  it("renders all filter buttons", () => {
    render(<CodeConnectFiltersComponent selected={[]} onChange={() => {}} />);
    expect(screen.getByText("Java")).toBeInTheDocument();
    expect(screen.getByText("PHP")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Angular")).toBeInTheDocument();
  });

  it("calls onChange with the selected label and supports controlled toggle", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <CodeConnectFiltersComponent selected={[]} onChange={onChange} />,
    );

    const javaButton = screen.getByRole("button", { name: /java/i });
    expect(javaButton.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(javaButton);
    expect(onChange).toHaveBeenCalledWith(["Java"]);

    rerender(
      <CodeConnectFiltersComponent selected={["Java"]} onChange={onChange} />,
    );
    expect(javaButton.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(javaButton);
    expect(onChange).toHaveBeenCalledWith([]);

    rerender(<CodeConnectFiltersComponent selected={[]} onChange={onChange} />);
    expect(javaButton.getAttribute("aria-pressed")).toBe("false");
  });

  it("allows selecting several filters at the same time", () => {
    const onChange = vi.fn();

    const { rerender } = render(
      <CodeConnectFiltersComponent selected={[]} onChange={onChange} />,
    );

    const javaButton = screen.getByRole("button", { name: /java/i });
    const phpButton = screen.getByRole("button", { name: /php/i });

    expect(javaButton.getAttribute("aria-pressed")).toBe("false");
    expect(phpButton.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(javaButton);
    expect(onChange).toHaveBeenLastCalledWith(["Java"]);

    rerender(
      <CodeConnectFiltersComponent selected={["Java"]} onChange={onChange} />,
    );

    fireEvent.click(phpButton);
    expect(onChange).toHaveBeenLastCalledWith(["Java", "PHP"]);

    rerender(
      <CodeConnectFiltersComponent
        selected={["Java", "PHP"]}
        onChange={onChange}
      />,
    );

    expect(javaButton.getAttribute("aria-pressed")).toBe("true");
    expect(phpButton.getAttribute("aria-pressed")).toBe("true");
  });
});
