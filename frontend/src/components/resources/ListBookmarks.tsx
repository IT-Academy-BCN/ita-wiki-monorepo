import { FC } from "react";
import { IntResource } from "../../types";
import ResourceCard from "../ui/ResourceCard";

interface ListBookmarksProps {
  bookmarkedResources: IntResource[];
  toggleBookmark: (resource: IntResource) => void;
}

export const ListBookmarks: FC<ListBookmarksProps> = ({
  bookmarkedResources,
  toggleBookmark,
}) => {
  return (
    <ul className="flex flex-col gap-2 py-8">
      {bookmarkedResources.map((resource: IntResource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          isBookmarked={true}
          toggleBookmark={() => toggleBookmark(resource)}
        />
      ))}
    </ul>
  );
};
