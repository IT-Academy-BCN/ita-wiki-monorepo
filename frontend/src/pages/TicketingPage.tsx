import { JSX, useState } from "react";
import Container from "../components/ui/Container";
import PageTitle from "../components/ui/PageTitle";
import { TicketingCreateForm } from "../components/ticketing/TicketingCreateForm";
import TicketCommentForm from "../components/ticketing/TicketCommentForm";
import { useCreateTicketing } from "../hooks/useCreateTicketing";
import { useTicketingGetAll } from "../hooks/useTicketingGetAll";
import { useTicketComments } from "../hooks/useTicketComments";
import TicketList from "../components/tickets/TicketList";
import { useUserContext } from "../context/UserContext";
import { STATUS_LABELS } from "../components/tickets/ticketConstants";
import type {
  IntCreateTicket,
  TicketStatus,
  ApiTicketData,
} from "../types/ticketingTypes";
import TicketDetailModal from "../components/tickets/TicketDetailModal";
import ButtonComponent from "../components/atoms/ButtonComponent";
import { roles } from "../data/tempRoles";

const DEFAULT_STATUSES: TicketStatus[] = ["pending", "in_progress"];

const TicketingPage = (): JSX.Element => {
  const { submitTicketing } = useCreateTicketing();
  const { tickets, isLoading, errorMessage, refetch } = useTicketingGetAll();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<ApiTicketData | null>(
    null,
  );
  const { user } = useUserContext();
  const currentUserId = user?.id;
  const isStudent = user?.role === roles.STUDENT;
  const [statusFilter, setStatusFilter] =
    useState<TicketStatus[]>(DEFAULT_STATUSES);
  const {
    comments,
    error: commentError,
    submitComment,
    editComment,
  } = useTicketComments(selectedTicketId ?? 0);

  const handleCreateTicket = async (
    ticketData: IntCreateTicket,
  ): Promise<void> => {
    try {
      await submitTicketing(ticketData);
      refetch();
    } catch {
      // error already handled by useCreateTicketing error state
    }
  };

  const handleCommentSubmit = async (text: string): Promise<void> => {
    if (comments[0]) {
      await editComment(comments[0].id, text);
    } else {
      await submitComment(text);
    }
  };

  const toggleStatus = (status: TicketStatus) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );
  };

  const filteredTickets =
    statusFilter.length === 0
      ? tickets
      : tickets.filter((t) => statusFilter.includes(t.status));

  return (
    <>
      <PageTitle title="Ticketing" />
      <Container className="xl:!px-16 md:!px-10 sm:!py-12 !px-6 !py-6">
        <TicketingCreateForm onSubmit={handleCreateTicket} />
        <div className="flex gap-4 mb-4">
          {(Object.keys(STATUS_LABELS) as TicketStatus[]).map((status) => (
            <label
              key={status}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={statusFilter.includes(status)}
                onChange={() => toggleStatus(status)}
              />
              <span className="text-sm">{STATUS_LABELS[status]}</span>
            </label>
          ))}
          {statusFilter.length > 0 && (
            <button
              onClick={() => setStatusFilter([])}
              className="text-sm text-blue-600 underline"
            >
              Mostrar tots
            </button>
          )}
        </div>
        {isStudent && (
          <ButtonComponent
            className="w-full flex justify-start"
            variant="discreet"
            onClick={() => {}}
          >
            Veure suggeriments
          </ButtonComponent>
        )}
        <TicketList
          tickets={filteredTickets}
          isLoading={isLoading}
          error={errorMessage}
          onCommentClick={setSelectedTicketId}
          onViewDetail={(ticket) => {
            setSelectedTicket(ticket);
            setIsModalOpen(true);
          }}
        />
        <TicketDetailModal
          ticket={selectedTicket}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        {selectedTicketId !== null && (
          <TicketCommentForm
            onSubmit={handleCommentSubmit}
            onClose={() => setSelectedTicketId(null)}
            error={commentError}
            initialValue={comments[0]?.comment}
            authorId={comments[0]?.user_id}
            date={comments[0]?.created_at}
            currentUserId={currentUserId ?? undefined}
          />
        )}
      </Container>
    </>
  );
};

export default TicketingPage;
