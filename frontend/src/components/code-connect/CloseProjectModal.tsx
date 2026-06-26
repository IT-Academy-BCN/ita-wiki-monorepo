import { useState } from 'react';
import GenericModal from '../ui/Modal/GenericModal';

interface CloseProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (githubUrl: string, youtubeUrl: string) => Promise<void>;
  isSubmitting: boolean;
}

function CloseProjectModal({ isOpen, onClose, onConfirm, isSubmitting }: CloseProjectModalProps) {
  const [githubUrl, setGithubUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Completar projecte"
      showPrimaryButton
      primaryButtonText={isSubmitting ? 'Guardant...' : 'Guardar'}
      primaryButtonAction={isSubmitting ? undefined : () => onConfirm(githubUrl, youtubeUrl)}
      showSecondaryButton
      secondaryButtonText="Cancel·lar"
      secondaryButtonAction={onClose}
    >
      <p className="text-sm text-gray-500 mb-4">
        Afegeix els enllaços del projecte (opcional)
      </p>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 text-left">
          <label htmlFor="github-url" className="text-sm font-medium text-gray-700">URL de GitHub</label>
          <input
            id="github-url"
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col gap-1 text-left">
          <label htmlFor="youtube-url" className="text-sm font-medium text-gray-700">URL de YouTube</label>
          <input
            id="youtube-url"
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </GenericModal>
  );
}

export default CloseProjectModal;
