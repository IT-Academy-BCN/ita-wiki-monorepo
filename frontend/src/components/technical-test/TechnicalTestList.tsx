import { FC } from "react";
import useTechnicalTestList from "../../hooks/useTechnicalTestList";
import TechnicalTestCard from "./TechnicalTestCard";
import { useMinLoading } from "../../hooks/useMinLoading";
import TechnicalTestSkeleton from "./TechnicalTestSkeleton";
import EmptyState from "../ui/EmptyState";

interface TechnicalTestListProps {
  language?: string | null;
  sortByLikes?: boolean;
  difficulty?: string | null;
  year?: number | null;
}

const TechnicalTestList: FC<TechnicalTestListProps> = ({
  language,
  sortByLikes,
  difficulty,
  year,
}) => {
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

  const filteredTests = technicalTests.filter((t) => {
    if (language && t.language !== language) return false;
    if (difficulty && t.difficulty_level !== difficulty) return false;
    if (year && new Date(t.created_at).getFullYear() !== year) return false;
    return true;
  });

  const sortedTests = sortByLikes
    ? [...filteredTests].sort(
        (a, b) => (b.like_count ?? 0) - (a.like_count ?? 0),
      )
    : filteredTests;

  if (filteredTests.length === 0) {
    return (
      <EmptyState
        text="No hi ha proves tècniques"
        subtext="Torna-ho a provar més tard o crea una nova prova"
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {sortedTests.map((test) => (
        <TechnicalTestCard key={test.id} test={test} />
      ))}
    </ul>
  );
};

export default TechnicalTestList;
