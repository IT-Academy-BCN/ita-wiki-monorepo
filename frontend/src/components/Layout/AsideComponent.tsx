import { Link, useLocation, useNavigate } from "react-router";
import logoItAcademy from "../../assets/LogoItAcademy.svg";

import { AsideNavbarData, AsideConfigData } from "./aside/asideContent.tsx";
import { AsideNavbarLink } from "./aside/AsideNavbarLink";
import { AsideConfigLink } from "./aside/AsideConfigLink";

const AsideComponent: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

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
      </section>

      <section className="py-6">
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
