import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, type Mock } from "vitest";
import useCodeConnectDetails from "../useCodeConnectDetails";
import { fetchCodeConnectProject } from "../../api/endPointCodeConnect";

vi.mock("../../api/endPointCodeConnect");

describe("useCodeConnectDetails Hook", () => {
  it("retorna les dades del projecte i gestiona el loading", async () => {
    const mockData = { data: { title: "Projecte Vitest" } };

    (fetchCodeConnectProject as Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useCodeConnectDetails("1"));

    await waitFor(() => {
      expect(result.current.codeConnectProject).toEqual(mockData);
    });

    expect(result.current.isLoading).toBe(false);
  });
});
