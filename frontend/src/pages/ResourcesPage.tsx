import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { categories } from "../data/categories";
import { ResourcesFiltersProvider } from "../context/ResourcesFiltersContext";

const ResourcesPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!category) {
      navigate(`/resources/${categories[0]}`);
    }
  }, [category, navigate]);

  return (
    <ResourcesFiltersProvider>
      <div>Recursos de programació</div>
      <div>
        <div>Javascript, PHP, Java, BBDD, Python</div>
        <div>Ordenar, filtres</div>
      </div>
      <div>Llista de recursos</div>
    </ResourcesFiltersProvider>
  );
};

export default ResourcesPage;
