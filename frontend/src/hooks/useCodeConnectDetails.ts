import { useEffect, useState } from "react";
import { fetchCodeConnectProject } from "../api/endPointCodeConnect";
import type { ApiProjectResponse } from "../types/codeConnectTypes";

const useCodeConnectDetails = (projectId: string | null) => {
  const [codeConnectProject, setCodeConnectProject] =
    useState<ApiProjectResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!projectId) {
        setCodeConnectProject(null);
        setErrorMessage(null);
        return;
      }

      const numericProjectId = Number(projectId);

      if (Number.isNaN(numericProjectId)) {
        setCodeConnectProject(null);
        setErrorMessage("Invalid project id");
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await fetchCodeConnectProject(numericProjectId);

        if (!data) {
          throw new Error("No data received");
        }

        setCodeConnectProject(data);
      } catch (error) {
        console.error(error);

        const resolvedErrorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "object" &&
                error !== null &&
                "message" in error &&
                typeof error.message === "string"
              ? error.message
              : "Unknown error";

        setCodeConnectProject(null);
        setErrorMessage(resolvedErrorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  return { codeConnectProject, isLoading, errorMessage };
};

export default useCodeConnectDetails;
