import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";

import TechnicalTestsHeader from "../components/technical-test/TechnicalTestsHeader";
import TechnicalTestList from "../components/technical-test/TechnicalTestList";

function MyTechnicalTestsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toastShown = useRef(false);
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.successMessage && !toastShown.current) {
      toast.success(location.state.successMessage);
      toastShown.current = true;
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Proves tècniques</h1>
      <TechnicalTestsHeader onCategoryChange={setLanguageFilter} />
      <TechnicalTestList language={languageFilter} />
    </div>
  );
}

export default MyTechnicalTestsPage;
