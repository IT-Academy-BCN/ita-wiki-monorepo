import { useState } from "react";
import { useParams } from "react-router";
import CloseProjectModal from "../components/code-connect/CloseProjectModal";
import PendingRequestList from "../components/code-connect/pendingRequests/PendingRequestList";
import ProjectTeam from "../components/code-connect/projectTeam/ProjectTeam";
import Container from "../components/ui/Container";
import PageTitle from "../components/ui/PageTitle";
import useCodeConnectDetails from "../hooks/useCodeConnectDetails";
import { displayLanguageIcon } from "../utils/iconUtils";

const CodeConnectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = async (_githubUrl: string, _youtubeUrl: string) => {
    setIsCompleted(true);
    setIsModalOpen(false);
  };

  const { codeConnectProject, isLoading, errorMessage } = useCodeConnectDetails(
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

        {!isLoading && errorMessage && <p>{errorMessage}</p>}

        {!isLoading && !errorMessage && codeConnectProject?.data && (
          <div className="flex flex-col lg:flex-row gap-8 w-full">
            <div className="lg:w-2/3">
              <h2 className="text-[26px] font-extrabold text-left mb-10">
                {codeConnectProject.data.title ||
                  "No s'ha pogut carregar el títol del projecte."}
              </h2>

              <PendingRequestList
                projectId={codeConnectProject.data.id}
                languageFrontend={displayLanguageIcon(
                  codeConnectProject.data.language_frontend,
                )}
                languageBackend={displayLanguageIcon(
                  codeConnectProject.data.language_backend,
                )}
              />
              <h3 className="text-[22px] font-extrabold mb-5">Descripció:</h3>
              <p className="text-[16px] mb-10">
                {codeConnectProject.data?.description ||
                  "Aquesta informació no està disponible a la base de dades."}
              </p>
              <h3 className="text-[22px] font-extrabold mb-5">Roadmap:</h3>
              {codeConnectProject?.data?.roadmap?.length ? (
                <>
                  <ul>
                    {codeConnectProject.data.roadmap.map((task, index) => (
                      <li key={index}>{task.task}</li>
                    ))}
                  </ul>
                </>
              ) : (
                "Aquesta informació no està disponible a la base de dades."
              )}

              {!isCompleted ? (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="mt-6 text-primary hover:opacity-80 transition-opacity"
                >
                  Marcar com a complet
                </button>
              ) : (
                <span className="mt-6 font-medium text-gray-500 flex items-center gap-1">
                  ✓ Completat
                </span>
              )}
            </div>

            <div className="lg:w-1/3 flex-shrink-0 min-w-[320px] flex lg:justify-end">
              <ProjectTeam
                logoFront={displayLanguageIcon(
                  codeConnectProject.data.language_frontend,
                )}
                logoBack={displayLanguageIcon(
                  codeConnectProject.data.language_backend,
                )}
                contributors={codeConnectProject.data.contributors}
                timeDuration={codeConnectProject.data.time_duration}
                projectId={codeConnectProject.data.id}
                projectOwnerId={codeConnectProject.data.user_id}
              />
            </div>
          </div>
        )}
      </Container>
      <CloseProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        isSubmitting={false}
      />
    </>
  );
};

export default CodeConnectDetails;
