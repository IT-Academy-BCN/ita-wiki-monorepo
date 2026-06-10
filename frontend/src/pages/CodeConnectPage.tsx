import { useState } from "react";
import { useNavigate } from "react-router";
import ButtonComponent from "../components/atoms/ButtonComponent";
import CodeConnectFiltersComponent from "../components/code-connect/CodeConnectFiltersComponent";
import ProjectList from "../components/code-connect/projectList/ProjectList";
import Container from "../components/ui/Container";
import PageTitle from "../components/ui/PageTitle";

const CodeConnectPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string[]>([]);
  const [showMyProjects, setShowMyProjects] = useState<boolean>(false);

  return (
    <>
      <PageTitle title="Llista de projectes Code Connect" />
      <Container className="xl:!px-16 md:!px-10 sm:!py-12 !px-6 !py-6">
        <div className="flex justify-between flex-wrap items-start">
          <h2 className="text-[26px] font-bold text-black text-left">
            Code Connect
          </h2>
          <div className="flex items-center gap-3 py-3 sm:py-0">
            <ButtonComponent
              variant="custom"
              className="text-primary font-[600] text-[14px] h-[41px] min-w-[152px] cursor-pointer hover:opacity-90"
              onClick={() => setShowMyProjects(!showMyProjects)}
            >
              Els meus projectes
            </ButtonComponent>
            <ButtonComponent
              variant="primary"
              onClick={() => navigate("/codeconnect/create")}
            >
              Crear projecte
            </ButtonComponent>
          </div>
        </div>
        <p className="text-black py-5">Vull practicar com a developer de:</p>
        <CodeConnectFiltersComponent selected={filter} onChange={setFilter} />
        <ProjectList filter={filter} />
      </Container>
    </>
  );
};

export default CodeConnectPage;
