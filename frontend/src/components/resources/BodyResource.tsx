import { FC } from "react";
import { TypChildren } from "../../types";

export const BodyResource: FC<TypChildren> = ({ children }) => {
  return (
    <section
      data-testid="body-resource"
      className="flex gap-2 w-full justify-between p-4"
    >
      {children}
    </section>
  );
};
