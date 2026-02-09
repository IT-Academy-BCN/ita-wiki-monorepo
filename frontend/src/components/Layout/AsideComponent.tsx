import { Link, useLocation, useNavigate } from "react-router";
import classNames from "classnames";

import Bookmark from "../../assets/Bookmark.svg";
import CreatedResources from "../../assets/CreatedResources.svg";

const AsideComponent: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const isPathActive = (path: string) => currentPath === path;

  const isResourcesPathActive = (generalPath: string) =>
    location.pathname.startsWith(generalPath) &&
    !location.pathname.includes("technical");

  return (
    <aside className="flex flex-col px-6 lg:w-56 py-4">
      <section>
        <ul className="py-6 space-y-3">
          <li className="flex items-center space-x-3 mb-5">
            {isPathActive("/") && (
              <span className="w-3 h-3 rounded-full bg-primary" />
            )}
            <Link
              to="/"
              className={classNames("transition-colors", {
                "!text-black !font-bold": isPathActive("/"),
                "text-gray-400": !isPathActive("/"),
              })}
            >
              Inici
            </Link>
          </li>

          <li className="flex items-center space-x-3 mb-5">
            {isResourcesPathActive("/resources/") && (
              <span className="w-3 h-3 rounded-full bg-primary" />
            )}
            <Link
              to="/resources/React"
              className={classNames("transition-colors", {
                "!text-black !font-bold": isResourcesPathActive("/resources/"),
                "text-gray-400": !isResourcesPathActive("/resources/"),
              })}
            >
              Recursos
            </Link>
          </li>

          <li className="flex items-center space-x-3 mb-5">
            {isPathActive("/resources/technical-test/all-tech-tests") && (
              <span className="w-3 h-3 rounded-full bg-primary" />
            )}
            <Link
              to="/resources/technical-test/all-tech-tests"
              className={classNames("transition-colors", {
                "!text-black !font-bold": isPathActive(
                  "/resources/technical-test/all-tech-tests",
                ),
                "text-gray-400": !isPathActive(
                  "/resources/technical-test/all-tech-tests",
                ),
              })}
            >
              Proves tècniques
            </Link>
          </li>

          <li className="flex items-center space-x-3 mb-5">
            {isResourcesPathActive("/codeconnect") && (
              <span className="w-3 h-3 rounded-full bg-primary" />
            )}
            <Link
              to="/codeconnect"
              className={classNames("transition-colors", {
                "!text-black !font-bold": isPathActive("/codeconnect"),
                "text-gray-400": !isPathActive("/codeconnect"),
              })}
            >
              Code Connect
            </Link>
          </li>
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
