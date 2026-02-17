import { Link, useLocation } from "react-router";
import logoItAcademy from "../../assets/LogoItAcademy.svg";

import { AsideNavbarData, AsideConfigData } from "./aside/asideContent.tsx";
import { AsideNavbarLink } from "./aside/AsideNavbarLink";
import { AsideConfigLink } from "./aside/AsideConfigLink";

const AsideComponent: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isPathActive = (path: string) => currentPath === path;

  return (
    <aside className="flex flex-col lg:min-w-70 sticky top-0 bg-white h-screen overflow-hidden">
      <section className="flex-1 flex flex-col min-h-0 px-3 pt-5 space-y-2">
        <div className="flex justify-start flex-shrink-0">
          <Link to="/">
            <img src={logoItAcademy} alt="logo" width={"130px"} />
          </Link>
        </div>
        <nav className="flex-1 min-h-0 overflow-y-auto">
          <ul className="space-y-3 text-[11px] sm:text-xs md:text-xs">
            {AsideNavbarData.map((data, i) => (
              <AsideNavbarLink
                key={i}
                label={data.label}
                path={data.ref}
                isActive={isPathActive(data.ref)}
                icon={data.icon}
              />
            ))}
          </ul>
        </nav>
      </section>

      <section className="flex-shrink-0 px-3 pt-6 pb-4 text-[11px] sm:text-xs md:text-xs">
        <div className="-mx-4 border-t"></div>
        <ul className="py-6 space-y-3">
          {AsideConfigData.map((data) => (
            <AsideConfigLink
              key={data.label}
              label={data.label}
              path={data.ref}
              isActive={isPathActive(data.ref)}
              icon={data.icon}
            />
          ))}
        </ul>
      </section>
    </aside>
  );
};

export default AsideComponent;
