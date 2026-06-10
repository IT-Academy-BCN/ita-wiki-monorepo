import { useEffect, useState } from "react";
import { fetchPointsHistory } from "../api/endPointLeagues";
import type { PointsHistoryEntry } from "../types/league";

export const useGetPointsHistory = () => {
  const [history, setHistory] = useState<PointsHistoryEntry[]>([]);

  const getHistory = async (): Promise<void> => {
    const controller = new AbortController();
    try {
      const data = await fetchPointsHistory(controller.signal);
      setHistory(data);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.log(err instanceof Error ? err.message : "Unknown error");
    } finally {
      controller.abort();
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  return { history };
};
