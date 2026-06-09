import { renderHook, act } from "@testing-library/react";
import {
  ProjectJoinProvider,
  useProjectJoinContext,
} from "../ProjectJoinContext";

function wrapper({ children }: any) {
  return <ProjectJoinProvider>{children}</ProjectJoinProvider>;
}

describe("ProjectJoinContext", () => {
  it("adds request correctly", () => {
    const { result } = renderHook(() => useProjectJoinContext(), { wrapper });

    act(() => {
      result.current.addRequest(1, {
        area: "frontend",
        index: 0,
        role: "Frontend Developer",
        status: "pending",
      });
    });

    expect(result.current.requests[1]).toHaveLength(1);
  });

  it("prevents duplicates", () => {
    const { result } = renderHook(() => useProjectJoinContext(), { wrapper });

    act(() => {
      const slot = {
        area: "frontend",
        index: 0,
        role: "Frontend Developer",
        status: "pending",
      };

      result.current.addRequest(1, slot);
      result.current.addRequest(1, slot);
    });

    expect(result.current.requests[1]).toHaveLength(1);
  });
});
