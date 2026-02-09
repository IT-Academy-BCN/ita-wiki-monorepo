import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProjectJoin } from "../useProjectJoin";
import { joinProject } from "../../api/endPointJoinProject";

vi.mock("../../api/endPointJoinProject", () => ({
  joinProject: vi.fn().mockResolvedValue({ success: true }),
}));

describe("useProjectJoin", () => {
  const projectId = 1;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initial state: modals closed, no slots, no selectedSlot", () => {
    const { result } = renderHook(() => useProjectJoin(projectId));

    expect(result.current.joinModal.isOpen).toBe(false);
    expect(result.current.decisionModal.isOpen).toBe(false);
    expect(result.current.joinModal.selectedSlot).toBeNull();
    expect(result.current.joinModal.isSubmitting).toBe(false);

    expect(result.current.slots.pendingSlots).toHaveLength(0);
    expect(result.current.slots.isPending("frontend", 0)).toBe(false);
    expect(result.current.slots.isAccepted("frontend", 0)).toBe(false);
    expect(result.current.slots.getStatus("frontend", 0)).toBeNull();
  });

  it("join modal open/close sets selectedSlot and toggles modal visibility", () => {
    const { result } = renderHook(() => useProjectJoin(projectId));

    act(() => {
      result.current.joinModal.open({
        area: "frontend",
        index: 0,
        role: "Frontend Developer",
      });
    });

    expect(result.current.joinModal.isOpen).toBe(true);
    expect(result.current.joinModal.selectedSlot).toMatchObject({
      area: "frontend",
      index: 0,
      role: "Frontend Developer",
      status: "pending",
    });

    act(() => {
      result.current.joinModal.close();
    });

    expect(result.current.joinModal.isOpen).toBe(false);
  });

  it("confirm without selectedSlot does not call joinProject", async () => {
    const { result } = renderHook(() => useProjectJoin(projectId));

    await act(async () => {
      await result.current.joinModal.confirm();
    });

    expect(joinProject).not.toHaveBeenCalled();
    expect(result.current.joinModal.isSubmitting).toBe(false);
  });

  it("successful confirm calls joinProject, adds pending slot, and prevents duplicates", async () => {
    const { result } = renderHook(() => useProjectJoin(projectId));

    act(() => {
      result.current.joinModal.open({
        area: "backend",
        index: 1,
        role: "Backend Developer",
      });
    });

    await act(async () => {
      await result.current.joinModal.confirm();
    });

    expect(joinProject).toHaveBeenCalledWith(projectId, "Backend Developer");
    expect(result.current.joinModal.isOpen).toBe(false);
    expect(result.current.joinModal.selectedSlot).toBeNull();

    expect(result.current.slots.isPending("backend", 1)).toBe(true);
    expect(result.current.slots.getStatus("backend", 1)).toBe("pending");

    // duplicate attempt
    act(() => {
      result.current.joinModal.open({
        area: "backend",
        index: 1,
        role: "Backend Developer",
      });
    });

    await act(async () => {
      await result.current.joinModal.confirm();
    });

    const slots = result.current.slots.pendingSlots;
    expect(
      slots.filter((s) => s.area === "backend" && s.index === 1),
    ).toHaveLength(1);
  });

  it("decisionModal.open does nothing when the slot does not exist", () => {
    const { result } = renderHook(() => useProjectJoin(projectId));

    act(() => {
      result.current.decisionModal.open("frontend", 99);
    });

    expect(result.current.decisionModal.isOpen).toBe(false);
    expect(result.current.joinModal.selectedSlot).toBeNull();
  });

  it("accepting a pending contributor sets status to accepted", async () => {
    const { result } = renderHook(() => useProjectJoin(projectId));

    act(() => {
      result.current.joinModal.open({
        area: "frontend",
        index: 0,
        role: "Frontend Developer",
      });
    });

    await act(async () => {
      await result.current.joinModal.confirm();
    });

    act(() => {
      result.current.decisionModal.open("frontend", 0);
    });

    expect(result.current.decisionModal.isOpen).toBe(true);

    act(() => {
      result.current.decisionModal.accept();
    });

    expect(result.current.decisionModal.isOpen).toBe(false);
    expect(result.current.slots.isAccepted("frontend", 0)).toBe(true);
    expect(result.current.slots.getStatus("frontend", 0)).toBe("accepted");
  });

  it("rejecting a pending contributor removes the slot", async () => {
    const { result } = renderHook(() => useProjectJoin(projectId));

    act(() => {
      result.current.joinModal.open({
        area: "backend",
        index: 2,
        role: "Backend Developer",
      });
    });

    await act(async () => {
      await result.current.joinModal.confirm();
    });

    expect(result.current.slots.isPending("backend", 2)).toBe(true);

    act(() => {
      result.current.decisionModal.open("backend", 2);
    });

    act(() => {
      result.current.decisionModal.reject();
    });

    expect(result.current.decisionModal.isOpen).toBe(false);
    expect(result.current.slots.isPending("backend", 2)).toBe(false);
    expect(result.current.slots.getStatus("backend", 2)).toBeNull();
  });

  it("when joinProject rejects, it hits catch and resets isSubmitting to false", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    vi.mocked(joinProject).mockRejectedValueOnce(new Error("boom"));

    const { result } = renderHook(() => useProjectJoin(projectId));

    act(() => {
      result.current.joinModal.open({
        area: "frontend",
        index: 0,
        role: "Frontend Developer",
      });
    });

    await act(async () => {
      await result.current.joinModal.confirm();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(result.current.joinModal.isSubmitting).toBe(false);

    consoleErrorSpy.mockRestore();
  });
});
