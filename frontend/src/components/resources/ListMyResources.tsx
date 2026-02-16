import { FC } from "react";
import { IntResource } from "../../types";
import ResourceCard from "../ui/ResourceCard";

import { useResources } from "../../context/ResourcesContext";

interface ListMyResourcesProps {
  myResources: IntResource[];
}

export const ListMyResources: FC<ListMyResourcesProps> = ({ myResources }) => {
  const { isBookmarked, toggleBookmark } = useResources();
  return (
    <ul className="flex flex-col gap-2 py-8">
      {myResources.map((resource: IntResource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          isBookmarked={isBookmarked(resource)}
          toggleBookmark={toggleBookmark}
        />
      ))}
    </ul>
  );
};
