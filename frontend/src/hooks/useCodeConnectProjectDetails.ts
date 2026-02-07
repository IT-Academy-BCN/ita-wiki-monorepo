import { useState, useEffect } from "react";
import { fetchCodeConnectProjectDetails } from "../api/endPointCodeConnect";
import type {
  CodeConnectProject,
  CodeConnectProjectDetailsResponse,
} from "../types/CodeConnectProjectTypes";

const isCodeConnectProject = (value: unknown): value is CodeConnectProject => {
  if (typeof value !== "object" || value === null) return false;

  const record = value as Record<string, unknown>;

  return (
    typeof record.title === "string" &&
    typeof record.time_duration === "string" &&
    typeof record.language_backend === "string" &&
    typeof record.language_frontend === "string" &&
    Array.isArray(record.contributors)
  );
};

const isCodeConnectProjectDetailsResponse = (
  value: unknown,
): value is CodeConnectProjectDetailsResponse => {
  if (typeof value !== "object" || value === null) return false;

  const record = value as Record<string, unknown>;

  return (
    typeof record.success === "boolean" &&
    typeof record.message === "string" &&
    isCodeConnectProject(record.data)
  );
};

export const useCodeConnectProjectDetails = (projectId: string | null) => {
  const [codeConnectProject, setCodeConnectProject] =
    useState<CodeConnectProjectDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!projectId) return;

      const numericProjectId = Number(projectId);
      if (Number.isNaN(numericProjectId)) {
        setCodeConnectProject(null);
        setErrorMessage("Invalid project id");
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response: unknown =
          await fetchCodeConnectProjectDetails(numericProjectId);

        if (!isCodeConnectProjectDetailsResponse(response)) {
          throw new Error("Invalid API response shape");
        }

        if (!response.success) {
          throw new Error(response.message || "API returned success=false");
        }

        setCodeConnectProject(response);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        console.error(error);
        setErrorMessage(message);
        setCodeConnectProject(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { codeConnectProject, isLoading, errorMessage };
};
