import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";

import TechnicalTestFilter from "../components/technical-test/TechnicalTestFilter";
import TechnicalTestList from "../components/technical-test/TechnicalTestList";
import LanguageTagsBar from "../components/technical-test/LanguageTagsBar";
import Container from "../components/ui/Container";

type TechnicalTestsFiltersState = {
  languages: string[];
  years: string[];
  difficulties: string[];
};

function MyTechnicalTestsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toastShown = useRef(false);

  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
  const [otherFilters, setOtherFilters] = useState<
    Pick<TechnicalTestsFiltersState, "years" | "difficulties">
  >({
    years: [],
    difficulties: [],
  });

  const filters: TechnicalTestsFiltersState = {
    languages: languageFilter ? [languageFilter] : [],
    ...otherFilters,
  };

  useEffect(() => {
    if (location.state?.successMessage && !toastShown.current) {
      toast.success(location.state.successMessage);
      toastShown.current = true;
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <Container>
      <div className="mb-6">
        <LanguageTagsBar onSelect={setLanguageFilter} />
      </div>
      <div className="flex flex-col md:flex-row">
        <TechnicalTestFilter
          onFiltersChange={({ years, difficulties }) =>
            setOtherFilters({ years, difficulties })
          }
        />
        <TechnicalTestList filters={filters} />
      </div>
    </Container>
  );
}

export default MyTechnicalTestsPage;
