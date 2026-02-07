import { useEffect, useMemo, useState } from "react";
import { fetchCodeConnectAllProjects } from "../api/endPointCodeConnect";
import type {
  CodeConnectProject,
  CodeConnectProjectsResponse,
  UseProjectsState,
} from "../types/CodeConnectProjectTypes";

const isCodeConnectProjectsResponse = (
  value: unknown,
): value is CodeConnectProjectsResponse => {
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

  const normalizedFilter = useMemo(() => {
    return filter ? filter.trim().toLowerCase() : null;
  }, [filter]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchProjects = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const json: unknown = await fetchCodeConnectAllProjects(
          abortController.signal,
        );

        if (!isCodeConnectProjectsResponse(json)) {
          throw new Error("Invalid API response shape");
        }

        if (!json.success) {
          throw new Error(json.message || "API returned success=false");
        }

        const incomingProjects = json.data;

        if (!normalizedFilter) {
          setProjects(incomingProjects);
          return;
        }

        const filtered = incomingProjects.filter((project) => {
          return (
            project.language_frontend.toLowerCase() === normalizedFilter ||
            project.language_backend.toLowerCase() === normalizedFilter
          );
        });

        setProjects(filtered);
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "name" in error &&
          (error as { name: unknown }).name === "AbortError"
        ) {
          return;
        }

        const message =
          error && typeof error === "object" && "message" in error
            ? String((error as { message: unknown }).message)
            : "Unknown error";

        setErrorMessage(message);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();

    return () => abortController.abort();
  }, [normalizedFilter]);

  return { projects, isLoading, errorMessage };
};
