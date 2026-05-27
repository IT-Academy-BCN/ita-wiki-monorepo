import ContentTypeBadge from "../resources/ContentTypeBadge";
import { Calendar } from "lucide-react";
import heartIcon from "../../assets/heart.svg";
import type { Tag, ResourceType } from "../../types";

export interface ResourceCardBodyProps {
  tags?: string[] | Tag[];
  type: ResourceType;
  likeCount?: number;
  formattedDate: string;
}

const ResourceCardBody = ({
  tags,
  type,
  likeCount,
  formattedDate,
}: ResourceCardBodyProps) => {
  return (
    <div>
      {tags && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 bg-white"
            >
              {typeof tag === "string" ? tag : tag.name}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-2 text-gray-500 font-medium">
        <div className="flex items-center gap-1.5">
          <ContentTypeBadge type={type} />
        </div>

        <div className="flex items-center gap-1.5">
          <img
            src={heartIcon}
            alt="heart-icon"
            className="w-5 h-5 opacity-60"
          />
          <span className="text-sm">{likeCount}</span>
        </div>

        <div className="flex items-center gap-1.5 ml-auto text-sm">
          <Calendar size={18} className="text-gray-400" />
          {formattedDate}
        </div>
      </div>
    </div>
  );
};

export default ResourceCardBody;
