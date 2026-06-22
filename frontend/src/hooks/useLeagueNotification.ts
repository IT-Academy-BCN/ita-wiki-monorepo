import { useEffect, useState } from "react";
import { dismissLeagueNotification } from "../api/endPointLeagues";
import type { LeagueNotificationResponse } from "../types/league";

export const useLeagueNotification = () => {
  const [notification, setNotification] = useState<LeagueNotificationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchNotification = async () => {
      try {
        setLoading(true);
        const data = await dismissLeagueNotification(controller.signal);
        setNotification(data);
        setError(null);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setNotification(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();

    return () => controller.abort();
  }, []);

  const dismiss = () => {
    setNotification({ hasChange: false });
  };

  return { notification, loading, error, dismiss };
};
