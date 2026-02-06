import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { categories } from "../data/categories";
import { ResourcesFiltersProvider } from "../context/ResourcesFiltersContext";
import { useResources } from "../context/ResourcesContext";
import { ResourcesList } from "../components/resources/ResourcesList";

const ResourcesPage = () => {
  const { resources } = useResources();
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!category) {
      navigate(`/resources/${categories[0]}`);
    }
  }, [category, navigate]);

  return (
    <ResourcesFiltersProvider>
      <div>Recursos de programación</div>
      <div>
        <div>Javascript, PHP, Java, BBDD, Python</div>
        <div>Ordenar, filtros</div>
      </div>
      <ResourcesList resources={resources} category={category} />
    </ResourcesFiltersProvider>
  );
};

export default ResourcesPage;
