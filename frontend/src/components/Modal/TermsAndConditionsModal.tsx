import TermsAndConditionsComponent from "../Layout/header/TermsAndConditionsComponent";

interface TermsAndConditionsModalProps {
  closeModal: () => void;
  title?: string;
}
export const TermsAndConditionsModal = ({
  closeModal,
  title,
}: TermsAndConditionsModalProps) => {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"
        onClick={handleBackdropClick}
      >
        <div className="bg-white px-28 py-6 rounded-2xl w-[70%] min-h-[35%] relative">
          <div className="flex flex-col justify-center items-start mt-10">
            {title && (
              <h2 className="text-[1.7rem] text-black font-extrabold mb-10">
                {title}
              </h2>
            )}
            <TermsAndConditionsComponent closeModal={closeModal} />
          </div>
        </div>
      </div>
    </>
  );
};
