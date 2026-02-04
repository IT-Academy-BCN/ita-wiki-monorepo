import { useEffect, useMemo, useState } from "react";
import type {
  CodeConnectProject,
  CodeConnectProjects,
  UseProjectsState,
} from "../types/CodeConnectProjectTypes";

const API_ENDPOINT = "http://localhost/api/codeconnect";

const buildProjectsUrl = (filter: string | null | undefined): string => {
  const url = new URL(API_ENDPOINT);

  if (filter) {
    url.searchParams.set("tech", filter);
  }

  return url.toString();
};

const isCodeConnectProjectResponse = (
  value: unknown,
): value is CodeConnectProjects => {
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
  const [projects, setProjects] = useState<CodeConnectProject[]>([]);
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

        if (!isCodeConnectProjectResponse(json)) {
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
