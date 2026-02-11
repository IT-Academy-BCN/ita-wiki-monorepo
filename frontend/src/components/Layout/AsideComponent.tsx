import { Link, useLocation, useNavigate } from "react-router";
import classNames from "classnames";

import Bookmark from "../../assets/Bookmark.svg";
import CreatedResources from "../../assets/CreatedResources.svg";

import logoItAcademy from "../../assets/LogoItAcademy.svg";

import { AsideNavbarData } from "./aside/asideContent.tsx";
import { AsideNavbarLink } from "./aside/AsideNavbarLink";

const AsideComponent: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const isPathActive = (path: string) => currentPath === path;

  return (
    <aside className="flex flex-col px-3 py-4 lg:min-w-70 sticky top-0 justify-between bg-white h-screen overflow-y-auto pt-5">
      <section className="space-y-10">
        <div className="flex justify-start">
          <Link to="/">
            <img src={logoItAcademy} alt="logo" width={"130px"} />
          </Link>
        </div>
        <ul className="py-6 space-y-3">
          {AsideNavbarData.map((data) => (
            <AsideNavbarLink
              label={data.label}
              path={data.ref}
              isActive={isPathActive(data.ref)}
              icon={data.icon}
            />
          ))}
        </ul>
      </section>

      <section className="py-6">
        <p className="pb-3 font-bold text-lg mb-2 text-black">
          Els meus recursos
        </p>

        <div className="flex flex-col gap-4">
          <div
            onClick={() => navigate("/resources/bookmarks")}
            className="flex items-center space-x-3 py-1 cursor-pointer"
          >
            <img src={Bookmark} alt="Bookmark icon" className="w-6 h-6" />
            <div
              className={classNames("transition-colors", {
                "!text-black !font-bold": isPathActive("/resources/bookmarks"),
                "text-[var(--color-gray-foreground)]": !isPathActive(
                  "/resources/bookmarks",
                ),
              })}
            >
              Guardats
            </div>
          </div>

          <div
            onClick={() => navigate("/resources/my-resources")}
            className="flex items-center space-x-3 py-1 cursor-pointer"
          >
            <img
              src={CreatedResources}
              alt="Create resources icon"
              className="w-6 h-6"
            />
            <div
              className={classNames("transition-colors", {
                "!text-black !font-bold": isPathActive(
                  "/resources/my-resources",
                ),
                "text-[var(--color-gray-foreground)]": !isPathActive(
                  "/resources/my-resources",
                ),
              })}
            >
              Creats
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
};

export default AsideComponent;
