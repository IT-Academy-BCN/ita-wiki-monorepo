import { useEffect, useState } from "react";
import { fetchCodeConnectAllProjects } from "../api/endPointCodeConnect";
import { Project } from "../types/codeConnectTypes";

const isAbortLikeError = (value: unknown): boolean => {
  if (!value || typeof value !== "object") return false;

  const record = value as Record<string, unknown>;

  // nou flux: el vostre endpoint converteix AbortError a CodeConnectError { code: "ABORTED" }
  if (record.code === "ABORTED") return true;

  // fallback per si algun dia arriba el DOMException directament
  return record.name === "AbortError";
};

export const useProjects = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchProjects = async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetchCodeConnectAllProjects(abortController.signal);

        if (!response.success) {
          throw new Error(response.message || "Invalid API response shape");
        }

        const incomingProjects = response.data;
        if (incomingProjects.length) {
          const newProjects = incomingProjects.map(p => ({
            id: p.id,
            title: p.title,
            duration: p.time_duration,
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            frontend: {
              tech: p.language_frontend,
              logo: `../assets/technologies/${p.language_frontend}-logo.svg`,
              positions: 2,
              participants: p.contributors
                ?.filter(c => c.programming_role === "Frontend Developer")
                ?.map(c => ({
                  ...c,
                  avatar: ""
                })) ?? []
            },
            backend: {
              tech: p.language_backend,
              logo: `../assets/technologies/${p.language_backend}-logo.svg`,
              positions: 2,
              participants: p.contributors
                ?.filter(c => c.programming_role === "Backend Developer")
                ?.map(c => ({
                  ...c,
                  avatar: ""
                })) ?? []
            }
          }));

          setProjects(newProjects);
        }
      } catch (error: unknown) {
        if (isAbortLikeError(error)) return;
        const message =
          error && typeof error === "object" && "message" in error
            ? String((error as { message: unknown }).message)
            : "Unknown error";

        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();

    return () => abortController.abort();
  }, []);

  return { projects, isLoading, errorMessage };
};
