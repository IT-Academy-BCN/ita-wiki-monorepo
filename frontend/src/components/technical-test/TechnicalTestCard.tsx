import { TechnicalTest } from "../../types/TechnicalTest";
import { contentForTechnicalTest } from "../technical-test/languageLabelsContent";
import { Link } from "react-router";
import { Clock, Heart, Calendar } from "lucide-react";
import { getLevelIcon } from "../../utils/getLevelIcon";

interface TechnicalTestCardProps {
  test: TechnicalTest;
}

const TechnicalTestCard = ({ test }: TechnicalTestCardProps) => {
  const language = contentForTechnicalTest.find(
    (item) => item.label === test.language,
  );
  const IconComponent = language?.icon;

  const formattedDate =
    typeof test.updated_at === "string" && isNaN(Date.parse(test.updated_at))
      ? test.updated_at
      : test.updated_at
        ? new Date(test.updated_at).toLocaleDateString("ca-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "Data desconeguda";

  const likeCount = test.like_count ?? 0;

  const levelIcon = getLevelIcon(test.title);

  return (
    <Link to={`/resources/technical-test/${test.id}`}>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 h-full hover:bg-gray-50 transition-colors duration-100">
        {/* Header: language icon + title + level icon */}
        <div>
          <div className="flex justify-between items-start">
            {IconComponent && (
              <div className="w-7 h-7 flex items-center justify-center">
                <IconComponent />
              </div>
            )}
          </div>
          <div className="text-xl font-bold text-gray-900 leading-tight mt-2">
            {test.title}
          </div>
        </div>

        {/* Body: description + tags + footer */}
        <div className="flex flex-col gap-3">
          {test.description && (
            <p className="text-sm text-gray-500 line-clamp-2">
              {test.description}
            </p>
          )}

          {test.tags && test.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {test.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-1.5 rounded-full border border-gray-200 text-sm font-medium text-gray-700 bg-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-1 text-gray-500 font-medium">
            <div className="flex items-center gap-1.5">
              <img src={levelIcon} alt="Test level" className="h-4" />
            </div>

            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-gray-400" />
              <span className="text-sm">30 min</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Heart size={16} className="text-gray-400" />
              <span className="text-sm">{likeCount}</span>
            </div>

            <div className="flex items-center gap-1.5 ml-auto text-sm">
              <Calendar size={16} className="text-gray-400" />
              {formattedDate}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TechnicalTestCard;
