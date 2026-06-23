import GenericModal from "../ui/Modal/GenericModal";
import type { ApiTicketData } from "../../types/ticketingTypes";

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
  if (!ticket) return null;

  return (
    <GenericModal isOpen={isOpen} onClose={onClose} size="lg">
      <p>{String(ticket.id).padStart(6, "0")}</p>
    </GenericModal>
  );
};

export default TicketDetailModal;
