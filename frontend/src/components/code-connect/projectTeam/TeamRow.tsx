import ProjectButton from "../../code-connect/projectCard/ProjectButton";

interface TeamRowProps {
  members: { name: string; avatar: string }[];
  emptySlots: number;
  onSlotClick?: (index: number) => void;
  selectedSlotIndex?: number | null;
  slotIndexOffset?: number;
}

const TeamRow = ({
  members,
  emptySlots,
  onSlotClick,
  selectedSlotIndex,
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
    {Array.from({ length: emptySlots }).map((_, index) => (
      <ProjectButton
        key={`empty-${index}`}
        onClick={() => onSlotClick?.(index)}
        isSelected={selectedSlotIndex === index}
      >
        +
      </ProjectButton>
    ))}
  </div>
);

export default TeamRow;
