import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import ButtonComponent from "../components/atoms/ButtonComponent";
import ResourcesHeader from "../components/resources/ResourcesHeader";
import { ResourcesList } from "../components/resources/ResourcesList";
import { useResources } from "../context/ResourcesContext";
import { ResourcesFiltersProvider } from "../context/ResourcesFiltersContext";

const ResourcesPage = () => {
  const { category } = useParams();
  const { resources } = useResources();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    category,
  );
  const navigate = useNavigate();

  return (
    <ResourcesFiltersProvider>
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-90px)] flex flex-col">
        <div className="flex justify-between flex-wrap items-start">
          <h1 className="text-2xl font-bold mb-6 shrink-0">
            Recursos de programació
          </h1>
          <div className="py-3 sm:py-0">
            <ButtonComponent
              variant="primary"
              onClick={() => navigate("/resources/add")}
            >
              Crear Recurso
            </ButtonComponent>
          </div>
        </div>
        <ResourcesHeader
          initialCategory={category}
          onCategoryChange={(cat) => setSelectedCategory(cat ?? undefined)}
        />
        <div
          data-testid="resources-cards-scroll-container"
          className="flex-1 overflow-y-auto pr-1"
        >
          <ResourcesList resources={resources} category={selectedCategory} />
        </div>
      </div>
    </ResourcesFiltersProvider>
  );
};

export default ResourcesPage;
