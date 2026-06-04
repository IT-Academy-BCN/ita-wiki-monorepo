import { JSX, useState } from "react";
import Container from "../components/ui/Container";
import PageTitle from "../components/ui/PageTitle";
import { TicketingCreateForm } from "../components/ticketing/TicketingCreateForm";
import TicketCommentForm from "../components/ticketing/TicketCommentForm";
import { useCreateTicketing } from "../hooks/useCreateTicketing";
import { useTicketingGetAll } from "../hooks/useTicketingGetAll";
import { useTicketComments } from "../hooks/useTicketComments";
import TicketList from "../components/tickets/TicketList";
import type { IntCreateTicket, TicketStatus } from "../types/ticketingTypes";

const DEFAULT_STATUSES: TicketStatus[] = ["pending", "in_progress"];

const STATUS_LABELS: Record<TicketStatus, string> = {
  pending: "Pendent",
  in_progress: "En progrés",
  blocked: "Bloquejat",
  ready: "Llest",
  closed: "Tancat",
};

const TicketingPage = (): JSX.Element => {
  const { submitTicketing } = useCreateTicketing();
  const { tickets, isLoading, errorMessage, refetch } = useTicketingGetAll();
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] =
    useState<TicketStatus[]>(DEFAULT_STATUSES);
  const {
    comments,
    error: commentError,
    submitComment,
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
        <TicketList
          tickets={filteredTickets}
          isLoading={isLoading}
          error={errorMessage}
          onCommentClick={setSelectedTicketId}
        />
        {selectedTicketId !== null && (
          <TicketCommentForm
            onSubmit={submitComment}
            onClose={() => setSelectedTicketId(null)}
            error={commentError}
            initialValue={comments[0]?.comment}
            authorId={comments[0]?.user_id}
            date={comments[0]?.created_at}
          />
        )}
      </Container>
    </>
  );
};

export default TicketingPage;
