import { useState, useEffect } from "react";
import { fetchCodeConnectProject } from "../api/endPointCodeConnect";
import type { ApiProjectResponse } from "../types/codeConnectTypes";

const useCodeConnectDetails = (projectId: string | null) => {
  const [codeConnectProject, setCodeConnectProject] =
    useState<ApiProjectResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data: ApiProjectResponse = await fetchCodeConnectProject(
          Number(projectId),
        );
        if (!data) throw new Error("No data received");
        setCodeConnectProject(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  return { codeConnectProject, isLoading };
};

export default useCodeConnectDetails;
