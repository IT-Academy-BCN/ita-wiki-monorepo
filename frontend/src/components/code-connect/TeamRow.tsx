import ProjectButton from "../code-connect/projectCard/ProjectButton";
import { TeamRowProps } from "../../types/CodeConnectProjectTypes";

const TeamRow = ({
  members,
  emptySlots,
  slotIndexOffset = 0,
  onEmptySlotClick,
}: TeamRowProps) => (
  <div className="w-full flex gap-6 pr-2 mb-4">
    {members.map((member, index) => (
      <figure className="flex flex-col items-center" key={index}>
        <img
          src={member.avatar}
          alt={member.name}
          className="w-10 h-10 rounded-full object-cover mb-1"
        />
        <figcaption className="text-xs font-bold text-gray-500">
          {member.name}
        </figcaption>
      </figure>
    ))}
    {Array.from({ length: emptySlots }).map((_, index) => {
      const slotIndex = slotIndexOffset + index;
      return (
        <ProjectButton
          key={`empty-${index}`}
          onClick={() => onEmptySlotClick?.(slotIndex)}
        >
          +
        </ProjectButton>
      );
    })}
  </div>
);

export default TeamRow;
