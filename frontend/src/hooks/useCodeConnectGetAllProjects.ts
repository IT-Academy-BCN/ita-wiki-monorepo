import { useEffect, useMemo, useState } from "react";
import { fetchCodeConnectAllProjects } from "../api/endPointCodeConnect";
import type {
  CodeConnectProject,
  UseProjectsState,
} from "../types/CodeConnectProjectTypes";

const isAbortLikeError = (value: unknown): boolean => {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;

  // nou flux: el vostre endpoint converteix AbortError a CodeConnectError { code: "ABORTED" }
  if (record.code === "ABORTED") return true;

  // fallback per si algun dia arriba el DOMException directament
  return record.name === "AbortError";
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
        const response = await fetchCodeConnectAllProjects(
          abortController.signal,
        );

        if (!response.success) {
          throw new Error(response.message || "Invalid API response shape");
        }

        const incomingProjects = response.data;

        if (!normalizedFilter) {
          setProjects(incomingProjects);
          return;
        }

        const filteredProjects = incomingProjects.filter((project) => {
          return (
            project.language_frontend.toLowerCase() === normalizedFilter ||
            project.language_backend.toLowerCase() === normalizedFilter
          );
        });

        setProjects(filteredProjects);
      } catch (error: unknown) {
        if (isAbortLikeError(error)) return;

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
