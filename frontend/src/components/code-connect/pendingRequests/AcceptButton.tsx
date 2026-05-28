import { updateContributorStatus } from "../../../api/endPointContributors";

type AcceptButtonProps = {
  projectId: number;
  contributorId: number;
};

export const AcceptButton = ({
  projectId,
  contributorId,
}: AcceptButtonProps) => {
  const handleAccept = async () => {
    try {
      await updateContributorStatus(projectId, contributorId, "accepted");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex items-center gap-2 justify-end">
      <button
        onClick={handleAccept}
        className="rounded-lg border-2 border-stake color-stale text-sm font-bold py-1 px-5 cursor-pointer hover:border-bg-primary hover:text-primary transition duration-300"
      >
        Acceptar
      </button>
    </div>
  );
};
