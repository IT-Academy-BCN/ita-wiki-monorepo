import { useLocation } from "react-router";

import { AsideNavbarData, AsideConfigData } from "./aside/asideContent.tsx";
import { AsideNavbarLink } from "./aside/AsideNavbarLink";
import { AsideConfigLink } from "./aside/asideConfigLink";

const AsideComponent: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isPathActive = (path: string) => currentPath === path;

  return (
    <aside className="flex flex-col px-6 lg:w-56 py-4">
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
