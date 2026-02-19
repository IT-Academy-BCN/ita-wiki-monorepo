import { FC } from "react";
import useTechnicalTestList from "../../hooks/useTechnicalTestList";
import TechnicalTestCard from "./TechnicalTestCard";
import { useMinLoading } from "../../hooks/useMinLoading";
import TechnicalTestSkeleton from "./TechnicalTestSkeleton";
import EmptyState from "../ui/EmptyState";

const TechnicalTestList: FC = () => {
  const { technicalTests, isLoading, error } = useTechnicalTestList();
  const showLoader = useMinLoading(isLoading);

  if (showLoader && !error) {
    return (
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {Array.from({ length: 6 }).map((_, index) => (
          <TechnicalTestSkeleton key={index} />
        ))}
      </ul>
    );
  }

  if (error) {
    return (
      <EmptyState
        text="Error al obtenir proves tècniques"
        subtext="Hi ha hagut un problema. Torna-ho a provar."
        textClassName="text-red-500"
      />
    );
  }

  if (!technicalTests?.length) {
    return (
      <EmptyState
        text="No hi ha proves tècniques"
        subtext="Torna-ho a provar més tard o crea una nova prova"
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {technicalTests.map((test) => (
        <TechnicalTestCard key={test.id} test={test} />
      ))}
    </ul>
  );
};

export default TechnicalTestList;
