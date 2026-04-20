import { useEffect, useState } from "react";

export function useMinLoading(isLoading: boolean) {
  const [showLoader, setShowLoader] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
    } else {
      setShowLoader(false);
    }
  }, [isLoading]);

  return showLoader;
}
