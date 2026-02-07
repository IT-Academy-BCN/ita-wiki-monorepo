import PageTitle from "../components/ui/PageTitle";
import { useCodeConnectProjectDetails } from "../hooks/useCodeConnectProjectDetails";
import mockData from "../mock/projectDetails.json";

import ProjectCard from "../components/code-connect/projectCard/ProjectCard";

import Container from "../components/ui/Container";
import { useParams } from "react-router";

const CodeConnectProjectDetails = () => {
  const { description, roadmap } = mockData.details[0];

  const { projectId } = useParams<{ projectId: string }>();

  const { codeConnectProject, isLoading } = useCodeConnectProjectDetails(
    projectId || null,
  );

  return (
    <>
      <PageTitle
        title={
          codeConnectProject?.data?.title || "Codeconnect | IT Academy Wiki"
        }
      />

      <Container className="px-4 py-6 lg:pl-8 xl:pl-6">
        {isLoading && <p>Carregant...</p>}

        {codeConnectProject?.data && (
          <div className="flex flex-col lg:flex-row gap-8 w-full">
            <div className="lg:w-2/3">
              <h2 className="text-[26px] font-extrabold text-left mb-10">
                {codeConnectProject?.data.title ||
                  "unable to load project title"}
              </h2>

              <p className="text-[16px] mb-20 whitespace-pre-line">
                {description}
              </p>

              <h3 className="text-[22px] font-extrabold mb-5">Roadmap</h3>
              <ol className="list-decimal list-inside">
                {(roadmap || []).map((item, index) => (
                  <li key={index} className="text-[16px] mb-2">
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:w-1/3 flex-shrink-0 min-w-[320px] flex lg:justify-end">
              <ProjectCard project={codeConnectProject?.data} />
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default CodeConnectProjectDetails;
