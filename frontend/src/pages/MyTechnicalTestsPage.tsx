import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";

import TechnicalTestsHeader from "../components/technical-test/TechnicalTestsHeader";
import TechnicalTestList from "../components/technical-test/TechnicalTestList";

function MyTechnicalTestsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const toastShown = useRef(false);

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
      <TechnicalTestsHeader />
      <TechnicalTestList />
    </div>
  );
}

export default MyTechnicalTestsPage;
