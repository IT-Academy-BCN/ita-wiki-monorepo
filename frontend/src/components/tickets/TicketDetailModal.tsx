import GenericModal from "../ui/Modal/GenericModal";
import CategoryIcon from "./CategoryIcon";
import calendarIcon from "../../assets/Calendar.svg";
import userIcon from "../../assets/user2.svg";
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  CATEGORY_LABELS,
} from "./ticketConstants";
import type { ApiTicketData } from "../../types/ticketingTypes";

const formatDate = (date: string) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

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
  return (
    <GenericModal isOpen={isOpen} onClose={onClose} size="lg">
      {ticket && (
        <div className="text-left flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold uppercase text-primary tracking-wide">
              Detall del tiquet
            </p>
            <h2 className="mt-1 text-2xl font-bold tabular-nums text-gray-900">
              {String(ticket.id).padStart(6, "0")}
            </h2>
          </div>

          <hr className="border-gray-200" />

          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Descripció
            </p>
            <p className="mt-2 text-sm text-gray-700">{ticket.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Estat
              </p>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {STATUS_LABELS[ticket.status]}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Prioritat
              </p>
              <p
                className={`mt-2 text-sm font-semibold ${ticket.priority ? PRIORITY_COLORS[ticket.priority] : "text-gray-400"}`}
              >
                {ticket.priority ? PRIORITY_LABELS[ticket.priority] : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Categoria
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-900">
                {ticket.category ? (
                  <>
                    <CategoryIcon category={ticket.category} />
                    {CATEGORY_LABELS[ticket.category]}
                  </>
                ) : (
                  "-"
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
                <img src={calendarIcon} alt="calendar icon" className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Data
                </p>
                <p className="mt-0.5 text-sm font-medium text-gray-900">
                  {formatDate(ticket.incident_date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
                <img src={userIcon} alt="user icon" className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Rol
                </p>
                <p className="mt-0.5 text-sm font-medium text-gray-900">
                  {ticket.code_connect?.role ?? "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </GenericModal>
  );
};

export default TicketDetailModal;
