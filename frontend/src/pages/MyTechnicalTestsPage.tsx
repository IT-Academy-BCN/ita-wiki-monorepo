import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";

import TechnicalTestsHeader from "../components/technical-test/TechnicalTestsHeader";
import TechnicalTestList from "../components/technical-test/TechnicalTestList";
import { FiltersValue } from "../components/technical-test/FiltersButton";

function MyTechnicalTestsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toastShown = useRef(false);
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
  const [sortByLikes, setSortByLikes] = useState(false);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);

  const handleFilter = ({ difficulty, year }: FiltersValue) => {
    setDifficulty(difficulty);
    setYear(year);
  };

  useEffect(() => {
    if (location.state?.successMessage && !toastShown.current) {
      toast.success(location.state.successMessage);
      toastShown.current = true;
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <div className="container mx-auto px-4 py-6 h-[calc(100vh-90px)] flex flex-col">
      <h1 className="text-2xl font-bold mb-6 shrink-0">Proves tècniques</h1>
      <TechnicalTestsHeader
        onCategoryChange={setLanguageFilter}
        onSortByLikes={setSortByLikes}
        onFilter={handleFilter}
      />
      <div
        data-testid="technical-tests-cards-scroll-container"
        className="flex-1 overflow-y-auto pr-1"
      >
        <TechnicalTestList
          language={languageFilter}
          sortByLikes={sortByLikes}
          difficulty={difficulty}
          year={year}
        />
      </div>
    </div>
  );
}

export default MyTechnicalTestsPage;
