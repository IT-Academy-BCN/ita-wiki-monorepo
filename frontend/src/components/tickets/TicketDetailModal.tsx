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
import { useTicketComments } from "../../hooks/useTicketComments";

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
  const { comments } = useTicketComments(ticket?.id ?? 0);
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
            <dl>
              <dt className="text-xs font-semibold uppercase text-muted-foreground">
                Estat
              </dt>
              <dd className="mt-2 text-sm font-medium text-gray-900">
                {STATUS_LABELS[ticket.status]}
              </dd>
            </dl>
            <dl>
              <dt className="text-xs font-semibold uppercase text-muted-foreground">
                Prioritat
              </dt>
              <dd
                className={`mt-2 text-sm font-semibold ${
                  ticket.priority
                    ? PRIORITY_COLORS[ticket.priority]
                    : "text-gray-400"
                }`}
              >
                {ticket.priority ? PRIORITY_LABELS[ticket.priority] : "-"}
              </dd>
            </dl>
            <dl>
              <dt className="text-xs font-semibold uppercase text-muted-foreground">
                Categoria
              </dt>
              <dd className="mt-2 text-sm font-medium text-gray-900">
                {ticket.category ? (
                  <>
                    <CategoryIcon category={ticket.category} />
                    {CATEGORY_LABELS[ticket.category]}
                  </>
                ) : (
                  "-"
                )}
              </dd>
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
                <img
                  src={calendarIcon}
                  alt="calendar icon"
                  className="w-4 h-4"
                />
              </div>
              <dl>
                <dt className="text-xs font-semibold uppercase text-muted-foreground">
                  Data
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-gray-900">
                  {formatDate(ticket.incident_date)}
                </dd>
              </dl>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-gray-100 bg-gray-50">
                <img src={userIcon} alt="user icon" className="w-4 h-4" />
              </div>
              <dl>
                <dt className="text-xs font-semibold uppercase text-muted-foreground">
                  Rol
                </dt>
                <dd className="mt-0.5 text-sm font-medium text-gray-900">
                  {ticket.code_connect?.role ?? "-"}
                </dd>
              </dl>
            </div>
          </div>
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
        </div>
      )}
    </GenericModal>
  );
};

export default TicketDetailModal;
