import { FC } from "react";
import { TypChildren } from "../../types";

export const ContentResource: FC<TypChildren> = ({ children }) => {
  return (
    <article
      data-testid="content-resource"
      className="flex flex-col flex-1 gap-2"
    >
      {children}
    </article>
  );
};
