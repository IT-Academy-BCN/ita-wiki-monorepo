import { updateContributorStatus } from "../../../api/endPointContributors";

type RejectButtonProps = {
  project: number;
  contributor: number;
};

export const RejectButton = ({ project, contributor }: RejectButtonProps) => {
  const handleReject = async () => {
    try {
      const res = await updateContributorStatus(
        project,
        contributor,
        "rejected",
      );
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex items-center gap-2 flex-1 justify-end">
      <button
        onClick={handleReject}
        className="rounded-lg border-2 border-stake color-stale text-sm font-bold py-1 px-5 cursor-pointer hover:border-bg-primary hover:text-primary transition duration-300"
      >
        Rebutjar
      </button>
    </div>
  );
};
