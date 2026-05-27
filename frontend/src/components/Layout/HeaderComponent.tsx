import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import addIcon from "../../assets/add.svg";
import arrowDown from "../../assets/arrow-down.svg";
import logOutIcon from "../../assets/logOut.svg";
import userIcon from "../../assets/user2.svg";
import { useUserContext } from "../../context/UserContext";
import { useChangeUserRole } from "../../hooks/useChangeUserRole";
import { TypUserRole } from "../../types";
import { Modal } from "../Modal/Modal";
import ButtonComponent from "../atoms/ButtonComponent";
import DropdownButtonComponent from "../atoms/DropdownButtonComponent";
import { AddUsersModal } from "../resources/AddUserModal";
import RoleDropdownComponent from "./header/RoleDropdownComponent";
import { SignInComponent } from "./header/SignInComponent";

const HeaderComponent = () => {
  const { user, signOut } = useUserContext();
  const { isChanging, updateUserRole } = useChangeUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  const [resource, setResource] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showChangeRoleDropdown, setShowChangeRoleDropdown] =
    useState<boolean>(false);
  const [devMode, setDevMode] = useState<boolean>(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [selectedLang, setSelectedLang] = useState<"CA" | "ES" | "EN">("CA");
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  useEffect(() => {
    const resourcePath =
      location.pathname.split("/resources/")[1]?.split("?")[0] || "";
    if (resourcePath !== resource) {
      setResource(resourcePath);
    }
  }, [location.pathname, resource]);

  useEffect(() => {
    const dropdowns = [
      { ref: dropdownRef, setter: setShowDropdown },
      { ref: langDropdownRef, setter: setShowLangDropdown },
      { ref: roleDropdownRef, setter: setShowChangeRoleDropdown },
    ];

    const handleClickOutside = (event: MouseEvent) => {
      dropdowns.forEach(({ ref, setter }) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setter(false);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "r"
      ) {
        e.preventDefault();
        setDevMode((prev) => !prev);
      }

      if (showChangeRoleDropdown) {
        setShowChangeRoleDropdown(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showChangeRoleDropdown, devMode]);

  const handleRoleChange = async (newRole: TypUserRole) => {
    const success = await updateUserRole(newRole);
    if (success) {
      setShowChangeRoleDropdown(false);
    }
  };

  const openModal = () => setIsModalOpen(true);

  const openAddUserModal = () => setIsAddUserModalOpen(true);
  const closeAddUserModal = () => setIsAddUserModalOpen(false);

  const userRole: TypUserRole | null = (user?.role as TypUserRole) ?? null;

  const hasPermission = userRole
    ? ["superadmin", "admin", "mentor"].includes(userRole)
    : false;

  return (
    <header className="hidden lg:flex py-4 px-6 items-center justify-end">
      <div className="flex items-center gap-[6px]">
        {hasPermission && (
          <ButtonComponent
            onClick={openAddUserModal}
            icon={addIcon}
            variant="icon"
            text="Afegir Usuari"
          ></ButtonComponent>
        )}

        {/* LANG SELECT DROPDOWN */}
        <div className="relative" ref={langDropdownRef}>
          <ButtonComponent
            variant="custom"
            className="inline-flex items-center justify-center h-[41px] px-4 text-[#808080] border-2 rounded-[10px] border-white bg-white hover:bg-[#dcdcdc] hover:border-[#808080] hover:scale-95 transition cursor-pointer"
            onClick={() => setShowLangDropdown((prev) => !prev)}
            title="Idioma"
          >
            <span className="mr-2">{selectedLang}</span>
            <img
              src={arrowDown}
              alt="arrow"
              className={`w-4 h-4 transition-transform ${showLangDropdown ? "rotate-180" : ""}`}
            />
          </ButtonComponent>

          {showLangDropdown && (
            <div className="absolute right-0 mt-2 w-[76px] bg-white border rounded-md shadow-lg z-50 py-1 text-center">
              <button
                onClick={() => {
                  setSelectedLang("CA");
                  setShowLangDropdown(false);
                }}
                className="py-1 text-sm text-[#4a4a4a] hover:bg-[#fcecec] transition w-full cursor-pointer"
              >
                CA
              </button>
              <button
                onClick={() => {
                  setSelectedLang("ES");
                  setShowLangDropdown(false);
                }}
                className="py-1 text-sm text-[#4a4a4a] hover:bg-[#fcecec] transition w-full cursor-pointer"
              >
                ES
              </button>
              <button
                onClick={() => {
                  setSelectedLang("EN");
                  setShowLangDropdown(false);
                }}
                className="py-1 text-sm text-[#4a4a4a] hover:bg-[#fcecec] transition w-full cursor-pointer"
              >
                EN
              </button>
            </div>
          )}
        </div>

        {/* AVATAR & DROPDOWN */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              title={user.github_user_name || ""}
              className="h-[41px] px-4 flex items-center gap-1 rounded-lg hover:bg-white border border-transparent hover:border-gray-300 transition cursor-pointer"
            >
              <img
                src={user.photoURL ?? userIcon}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <img
                src={arrowDown}
                alt="toggle dropdown"
                className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-50 px-2 py-2 flex flex-col gap-2">
                {/*Username*/}
                <DropdownButtonComponent
                  title={user.github_user_name || user.name}
                  disabled={true}
                />
                <hr className="h-px -mx-2 bg-gray-300 border-0" />
                {/*Role*/}
                <div className="relative" ref={roleDropdownRef}>
                  <DropdownButtonComponent
                    title={userRole}
                    onClick={() =>
                      setShowChangeRoleDropdown(!showChangeRoleDropdown)
                    }
                    disabled={false}
                    icon={arrowDown}
                  />
                  {showChangeRoleDropdown && (
                    <RoleDropdownComponent
                      userRole={userRole}
                      isChanging={isChanging}
                      onRoleChange={handleRoleChange}
                    />
                  )}
                </div>
                <hr className="h-px -mx-2 bg-gray-300 border-0" />
                {/*Cerrar sesión*/}
                <DropdownButtonComponent
                  title="Cerrar sesión"
                  onClick={() => {
                    setShowConfirmLogout(true);
                    setShowDropdown(false);
                  }}
                  icon={logOutIcon}
                />
              </div>
            )}
          </div>
        ) : (
          <div>
            <ButtonComponent
              icon={userIcon}
              variant="icon"
              text="Iniciar sessió"
              onClick={openModal}
            />
          </div>
        )}

        {/* MODAL LOGIN */}
        {isModalOpen && <SignInComponent setIsModalOpen={setIsModalOpen} />}

        {/* MODAL LOGOUT CONFIRM */}
        {showConfirmLogout && (
          <Modal
            closeModal={() => setShowConfirmLogout(false)}
            title="Confirmar sortida"
          >
            <p className="text-center my-4">
              ¿Estàs segur@ que vols tancar sessió?
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => {
                  signOut();
                  setShowConfirmLogout(false);
                  navigate("/");
                }}
                className="px-4 py-2 bg-[#b91879] text-white rounded-md hover:bg-[#98537c] cursor-pointer"
              >
                Sí, sortir
              </button>
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 cursor-pointer"
              >
                Cancel·lar
              </button>
            </div>
          </Modal>
        )}

        {/* MODAL ADD USER */}
        {isAddUserModalOpen && hasPermission && (
          <AddUsersModal
            onClose={closeAddUserModal}
            userRole={userRole}
            userID={user?.id ?? ""}
          />
        )}
      </div>
      {devMode && (
        <div className="fixed bottom-2 right-2 bg-yellow-200 text-xs rounded px-2 py-1 opacity-70 z-50">
          Mode dev actiu
        </div>
      )}
    </header>
  );
};

export default HeaderComponent;
