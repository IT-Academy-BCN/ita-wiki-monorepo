import { useEffect, useMemo, useState } from "react";
import type {
  ApiProjectsResponse,
  Project,
  UseProjectsState,
} from "../types/projectTypes";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

const buildProjectsUrl = (filter: string | null | undefined): string => {
  if (!API_BASE_URL) return "/api/codeconnect";

  const url = new URL("/codeconnect", API_BASE_URL);

  if (filter) {
    url.searchParams.set("tech", filter);
  }

  return url.toString();
};

const isApiProjectsResponse = (
  value: unknown,
): value is ApiProjectsResponse => {
  if (typeof value !== "object" || value === null) return false;

  const record = value as Record<string, unknown>;

  return (
    typeof record.success === "boolean" &&
    typeof record.message === "string" &&
    Array.isArray(record.data)
  );
};

export const useProjects = (
  filter: string | null | undefined,
): UseProjectsState => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const url = useMemo(() => buildProjectsUrl(filter), [filter]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchProjects = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json: unknown = await response.json();

        if (!isApiProjectsResponse(json)) {
          throw new Error("Invalid API response shape");
        }

        if (!json.success) {
          throw new Error(json.message || "API returned success=false");
        }

        setProjects(json.data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;

        const message =
          error instanceof Error ? error.message : "Unknown error";
        setErrorMessage(message);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();

    return () => abortController.abort();
  }, [url]);

  return { projects, isLoading, errorMessage };
};
