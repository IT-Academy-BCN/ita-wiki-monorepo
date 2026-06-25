import GenericModal from "../ui/Modal/GenericModal";
import type { ApiTicketData } from "../../types/ticketingTypes";
import { useTicketComments } from "../../hooks/useTicketComments";

interface TicketDetailModalProps {
  ticket: ApiTicketData | null;
  isOpen: boolean;
  onClose: () => void;
}

const TicketDetailModal = ({
  ticket,
  isOpen,
  onClose,
}: TicketDetailModalProps) => {
  const { comments } = useTicketComments(ticket?.id ?? 0);
  return (
    <GenericModal isOpen={isOpen} onClose={onClose} size="lg">
      {ticket && (
        <dl>
          <dt className="text-xs font-semibold uppercase text-muted-foreground">
            Comentari
          </dt>
          <dd
            className={`mt-2 rounded-[10px] border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm leading-relaxed ${
              comments[0] ? "text-gray-700" : "italic text-gray-400"
            }`}
          >
            {comments[0] ? comments[0].comment : "No hi ha comentaris"}
          </dd>
        </dl>
      )}
    </GenericModal>
  );
};

export default TicketDetailModal;
