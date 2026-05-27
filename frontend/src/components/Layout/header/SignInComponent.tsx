import { useState } from "react";
import { useUserContext } from "../../../context/UserContext";
import { Modal } from "../../Modal/Modal";
import { TermsAndConditionsModal } from "../../Modal/TermsAndConditionsModal";
import GitHubLogin from "../../github-login/GitHubLogin";

interface SignInComponentProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SignInComponent = ({ setIsModalOpen }: SignInComponentProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);

  const openTermsModal = () => setIsTermsModalOpen(true);
  const closeTermsModal = () => setIsTermsModalOpen(false);

  const { signIn } = useUserContext();

  const closeModal = () => setIsModalOpen(false);

  const handleSignIn = async () => {
    if (!isChecked) {
      setLoginError(true);
      return;
    }
    setIsLoading(true);
    try {
      await signIn();
      setIsModalOpen(false);
    } catch {
      setLoginError(true);
    }
    setIsLoading(false);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setLoginError(false);
  };

  return (
    <>
      <Modal closeModal={closeModal} title="Inici de sessió">
        <GitHubLogin onClick={handleSignIn} isLoading={isLoading} />
        <section className="flex items-center gap-2 mt-8 font-medium">
          <label htmlFor="terms">
            <input
              name="terms"
              id="terms"
              type="checkbox"
              onChange={handleCheckboxChange}
              checked={isChecked}
              className="hidden"
            />
            <div
              className={`w-5 h-5 flex items-center justify-center rounded border ${
                isChecked ? "bg-[#B91879] border-[#B91879]" : "border-gray-400"
              }`}
            >
              {isChecked && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              )}
            </div>
          </label>
          <p>
            Accepto{" "}
            <button
              className="underline cursor-pointer"
              onClick={() => openTermsModal()}
            >
              els termes legals
            </button>
          </p>
        </section>

        {loginError && (
          <div className="text-red-500 text-[1rem] mt-8 text-center font-medium">
            Ho sentim, no s'ha pogut iniciar sessió,
            <br /> contacti amb l'administrador
          </div>
        )}
      </Modal>
      {isTermsModalOpen && (
        <TermsAndConditionsModal
          closeModal={closeTermsModal}
          title="Termes Legals"
        />
      )}
    </>
  );
};
