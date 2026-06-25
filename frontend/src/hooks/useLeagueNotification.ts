import { useEffect, useState } from "react";
import { fetchLeagueNotification } from "../api/endPointLeagues";
import type { LeagueNotificationResponse } from "../types/league";

export const useLeagueNotification = () => {
  const [notification, setNotification] =
    useState<LeagueNotificationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const getNotification = async () => {
      try {
        setLoading(true);
        const data = await fetchLeagueNotification(controller.signal);

        if (data.hasChange) {
          const isDismissed = localStorage.getItem(
            `league_notified_${data.year}_${data.week_number}`,
          );
          if (isDismissed) {
            setNotification({ hasChange: false });
            return;
          }
        }

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

    getNotification();

    return () => controller.abort();
  }, []);

  const dismiss = () => {
    if (notification && notification.hasChange) {
      localStorage.setItem(
        `league_notified_${notification.year}_${notification.week_number}`,
        "true",
      );
    }
    setNotification({ hasChange: false });
  };

  return { notification, loading, error, dismiss };
};
