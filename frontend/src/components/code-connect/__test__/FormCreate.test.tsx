import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FormCreateCodeConnect from "../FormCreate";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { createCodeConnect } from "../../../api/endPointCodeConnect";

vi.mock("../../../api/endPointCodeConnect", () => ({
  createCodeConnect: vi.fn(),
}));

const mockCreateCodeConnect = vi.mocked(createCodeConnect);

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

const fillCompleteForm = async (user: ReturnType<typeof userEvent.setup>) => {
  const titleInput = screen.getByRole("textbox", {
    name: /títol/i,
  }) as HTMLInputElement;
  await user.type(titleInput, "Test Project");

  const descriptionTextarea = screen.getByRole("textbox", {
    name: /descripció/i,
  }) as HTMLInputElement;
  await user.type(descriptionTextarea, "Test description");

  const reactCheckbox = screen.getByRole("checkbox", { name: /react/i });
  await user.click(reactCheckbox);

  const nodeCheckbox = screen.getByRole("checkbox", { name: /node/i });
  await user.click(nodeCheckbox);

  const deadlineInput = screen.getByLabelText(
    /data límit d'inscripció/i,
  ) as HTMLInputElement;
  await user.type(deadlineInput, "2025-11-20");

  const timeInput = screen.getByLabelText(
    /durada del projecte/i,
  ) as HTMLInputElement;
  await user.type(timeInput, "2");

  const unitTimeSelect = screen.getByLabelText(/tipus durada/i);
  await user.selectOptions(unitTimeSelect, "month");

  const devsFrontInput = screen.getByLabelText(
    /nombre de programadors frontend/i,
  ) as HTMLInputElement;
  await user.type(devsFrontInput, "2");

  const devsBackInput = screen.getByLabelText(
    /nombre de programadors backend/i,
  ) as HTMLInputElement;
  await user.type(devsBackInput, "2");

  await waitFor(() => {
    expect(titleInput.value).toBe("Test Project");
    expect(descriptionTextarea.value).toBe("Test description");
    expect(devsFrontInput.value).toBe("2");
    expect(devsBackInput.value).toBe("2");
    expect(timeInput.value).toBe("2");
    expect((unitTimeSelect as HTMLSelectElement).value).toBe("month");
    expect(deadlineInput.value).toBe("2025-11-20");
  });
};

describe("FormCreateCodeConnect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateForm", () => {
    it("should show error when submitting empty form", async () => {
      renderWithRouter(<FormCreateCodeConnect />);

      const form = document.querySelector("form")!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it("should only allow to set a future inscription deadline", async () => {
      const user = userEvent.setup();
      renderWithRouter(<FormCreateCodeConnect />);

      const deadlineInput = screen.getByLabelText(
        /data límit d'inscripció/i,
      ) as HTMLInputElement;

      await user.type(deadlineInput, "2025-01-01");
      expect(deadlineInput).toBeInvalid();
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      await user.clear(deadlineInput);
      await user.type(deadlineInput, today);
      expect(deadlineInput).toBeInvalid();
      await user.clear(deadlineInput);
      await user.type(deadlineInput, "2030-01-01");
      expect(deadlineInput).toBeValid();
    });
  });

  it("should pass validation with all required fields filled correctly", async () => {
    const user = userEvent.setup();
    renderWithRouter(<FormCreateCodeConnect />);

    await fillCompleteForm(user);

    const submitButton = screen.getByRole("button", { name: /publicar/i });
    await user.click(submitButton);

    expect(toast.error).not.toHaveBeenCalledWith(
      "Completa tots els camps obligatoris.",
    );
  });
});

describe("handleSubmit", () => {
  it("should navigate on successful submission", async () => {
    const user = userEvent.setup();

    mockCreateCodeConnect.mockResolvedValueOnce({
      id: "123",
      title: "Test Project",
      techsFront: ["React"],
      techsBack: ["Node"],
      description: "Test description",
      numberDevsFront: 2,
      numberDevsBack: 2,
      time: 2,
      unitTime: "month",
    });

    renderWithRouter(<FormCreateCodeConnect />);

    await fillCompleteForm(user);

    expect(toast.error).not.toHaveBeenCalled();

    const form = screen
      .getByRole("textbox", { name: /títol/i })
      .closest("form");
    if (!form) throw new Error("Form not found");
    fireEvent.submit(form);

    await waitFor(
      () => {
        expect(mockCreateCodeConnect).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );

    expect(toast.success).toHaveBeenCalledWith(
      "Code Connect publicat amb exit",
    );
    expect(mockNavigate).toHaveBeenCalledWith("/codeconnect");
  });

  it("should prevent form submission when validation fails", async () => {
    const user = userEvent.setup();
    renderWithRouter(<FormCreateCodeConnect />);

    const submitButton = screen.getByRole("button", { name: /publicar/i });
    await user.click(submitButton);

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe("Input handling", () => {
  it("should update title when typing", async () => {
    const user = userEvent.setup();
    renderWithRouter(<FormCreateCodeConnect />);

    const titleInput = screen.getByRole("textbox", {
      name: /títol/i,
    }) as HTMLInputElement;

    await user.type(titleInput, "My Test Title");

    expect(titleInput.value).toBe("My Test Title");
  });

  it("should update description when typing", async () => {
    const user = userEvent.setup();
    renderWithRouter(<FormCreateCodeConnect />);

    const descriptionTextarea = screen.getByRole("textbox", {
      name: /descripció/i,
    }) as HTMLTextAreaElement;

    await user.type(descriptionTextarea, "My test description");

    expect(descriptionTextarea.value).toBe("My test description");
  });

  it("should enforce title character limit of 65", async () => {
    const user = userEvent.setup();
    renderWithRouter(<FormCreateCodeConnect />);

    const titleInput = screen.getByRole("textbox", {
      name: /títol/i,
    }) as HTMLInputElement;

    const longTitle = "a".repeat(70);
    await user.type(titleInput, longTitle);

    expect(titleInput.value.length).toBe(65);
  });

  it("should update frontend dev count when typing valid number", async () => {
    const user = userEvent.setup();
    renderWithRouter(<FormCreateCodeConnect />);

    const devsFrontInput = screen.getByLabelText(
      /nombre de programadors frontend/i,
    ) as HTMLInputElement;

    await user.clear(devsFrontInput);
    await user.type(devsFrontInput, "5");

    expect(devsFrontInput.value).toBe("5");
  });

  it("should update backend dev count when typing valid number", async () => {
    const user = userEvent.setup();
    renderWithRouter(<FormCreateCodeConnect />);

    const devsBackInput = screen.getByLabelText(
      /nombre de programadors backend/i,
    ) as HTMLInputElement;

    await user.clear(devsBackInput);
    await user.type(devsBackInput, "3");

    expect(devsBackInput.value).toBe("3");
  });
});

describe("Navigation and UI", () => {
  it("should navigate back to code connect when clicking back link", async () => {
    const user = userEvent.setup();
    renderWithRouter(<FormCreateCodeConnect />);

    const backLink = screen.getByText(/tornar a code connect/i);
    await user.click(backLink);

    expect(mockNavigate).toHaveBeenCalledWith("/codeconnect");
  });
  it("should display the time unit value options for the project duration in plural or singular depending on the time value entered previously by the user", async () => {
    const user = userEvent.setup();
    renderWithRouter(<FormCreateCodeConnect />);
    const timeInput = screen.getByLabelText(
      /durada del projecte/i,
    ) as HTMLInputElement;
    const monthOption = screen.getByRole("option", { name: /mes/i });
    const weekOption = screen.getByRole("option", { name: /setmana/i });
    expect(monthOption).toHaveTextContent("Mes");
    await user.clear(timeInput);
    await user.type(timeInput, "2");
    expect(monthOption).toHaveTextContent("Mesos");
    expect(weekOption).toHaveTextContent("Setmanes");
  });
});

describe("Tech selection", () => {
  it("should show error when submitting without selecting any frontend technology", async () => {
    const user = userEvent.setup();
    renderWithRouter(<FormCreateCodeConnect />);

    const nodeCheckbox = screen.getByRole("checkbox", { name: /node/i });
    await user.click(nodeCheckbox);

    const form = document.querySelector("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Selecciona almenys una tecnologia frontend.",
      );
    });
  });

  it("should show error when submitting without selecting any backend technology", async () => {
    const user = userEvent.setup();
    renderWithRouter(<FormCreateCodeConnect />);

    const reactCheckbox = screen.getByRole("checkbox", { name: /react/i });
    await user.click(reactCheckbox);

    const form = document.querySelector("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Selecciona almenys una tecnologia backend.",
      );
    });
  });

  it("should show placeholder '0' and empty value when number inputs are at default", () => {
    renderWithRouter(<FormCreateCodeConnect />);

    const timeInput = document.getElementById("time") as HTMLInputElement;
    const devsFrontInput = document.getElementById(
      "devs-front",
    ) as HTMLInputElement;
    const devsBackInput = document.getElementById(
      "devs-back",
    ) as HTMLInputElement;

    expect(timeInput.value).toBe("");
    expect(timeInput.placeholder).toBe("0");
    expect(devsFrontInput.value).toBe("");
    expect(devsFrontInput.placeholder).toBe("0");
    expect(devsBackInput.value).toBe("");
    expect(devsBackInput.placeholder).toBe("0");
  });
});
