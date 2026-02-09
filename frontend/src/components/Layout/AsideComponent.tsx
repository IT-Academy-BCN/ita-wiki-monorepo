import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import classNames from "classnames";

import Bookmark from "../../assets/Bookmark.svg";
import CreatedResources from "../../assets/CreatedResources.svg";

import { AsideNavbarData } from "./aside/asideContent.tsx";

import SearchComponent from "./header/SearchComponent";
import ButtonComponent from "../atoms/ButtonComponent";
import { AsideNavbarLink } from "./aside/AsideNavbarLink";

const AsideComponent: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [resource] = useState("");

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("search", query);
    navigate(`?${params.toString()}`);
  };

  const isPathActive = (path: string) => currentPath === path;

  return (
    <aside className="flex flex-col ps-5 lg:w-70 py-4">
      <SearchComponent onSearch={handleSearch} resetTrigger={resource} />

      <section className="w-[200px] my-5">
        <Link to="/resources/add" className="block w-full">
          <ButtonComponent className="w-full" type="button" variant="primary">
            Crear recurs
          </ButtonComponent>
        </Link>
      </section>

      <section>
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
