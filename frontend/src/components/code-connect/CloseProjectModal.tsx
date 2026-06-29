import { useState } from "react";
import GenericModal from "../ui/Modal/GenericModal";

interface CloseProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (githubUrl: string, youtubeUrl: string) => Promise<void>;
  isSubmitting: boolean;
}

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

function CloseProjectModal({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}: CloseProjectModalProps) {
  const [githubUrl, setGithubUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [githubUrlError, setGithubUrlError] = useState("");
  const [youtubeUrlError, setYoutubeUrlError] = useState("");

  const handleConfirm = () => {
    const githubError =
      githubUrl && !isValidUrl(githubUrl)
        ? "The GitHub URL must be a valid URL."
        : "";
    const youtubeError =
      youtubeUrl && !isValidUrl(youtubeUrl)
        ? "The YouTube URL must be a valid URL."
        : "";

    setGithubUrlError(githubError);
    setYoutubeUrlError(youtubeError);

    if (githubError || youtubeError) return;

    onConfirm(githubUrl, youtubeUrl);
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Completar projecte"
      showPrimaryButton
      primaryButtonText={isSubmitting ? "Guardant..." : "Guardar"}
      primaryButtonAction={isSubmitting ? undefined : handleConfirm}
      showSecondaryButton
      secondaryButtonText="Cancel·lar"
      secondaryButtonAction={onClose}
    >
      <p className="text-sm text-gray-500 mb-4">
        Afegeix els enllaços del projecte (opcional)
      </p>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 text-left">
          <label
            htmlFor="github-url"
            className="text-sm font-medium text-gray-700"
          >
            URL de GitHub
          </label>
          <input
            id="github-url"
            type="url"
            value={githubUrl}
            onChange={(e) => {
              setGithubUrl(e.target.value);
              setGithubUrlError("");
            }}
            placeholder="https://github.com/..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {githubUrlError && (
            <p className="text-xs text-red-500">{githubUrlError}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 text-left">
          <label
            htmlFor="youtube-url"
            className="text-sm font-medium text-gray-700"
          >
            URL de YouTube
          </label>
          <input
            id="youtube-url"
            type="url"
            value={youtubeUrl}
            onChange={(e) => {
              setYoutubeUrl(e.target.value);
              setYoutubeUrlError("");
            }}
            placeholder="https://youtube.com/..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {youtubeUrlError && (
            <p className="text-xs text-red-500">{youtubeUrlError}</p>
          )}
        </div>
      </div>
    </GenericModal>
  );
}

export default CloseProjectModal;
