import { useEffect, useMemo } from "react";

const PageTitle = ({ title }: { title: string }) => {
  const fullTitle = useMemo(
    () => (title ? `${title} | IT Academy Wiki` : "IT Academy Wiki"),
    [title],
  );

  useEffect(() => {
    document.title = fullTitle;
  }, [fullTitle]);

  return null;
};

export default PageTitle;
