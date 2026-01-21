import { ReactNode } from "react";

const Container = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="h-full flex flex-col">
      <div
        className={`${className} flex-1 bg-white rounded-xl mb-6 mx-6 py-8 px-15`}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
