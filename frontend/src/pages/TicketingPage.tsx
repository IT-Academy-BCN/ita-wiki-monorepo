import { JSX, useState } from "react";
import Container from "../components/ui/Container";
import PageTitle from "../components/ui/PageTitle";
import { TicketingCreateForm } from "../components/ticketing/TicketingCreateForm";
import TicketCommentForm from "../components/ticketing/TicketCommentForm";
import { useCreateTicketing } from "../hooks/useCreateTicketing";
import { useTicketingGetAll } from "../hooks/useTicketingGetAll";
import { useTicketComments } from "../hooks/useTicketComments";
import TicketList from "../components/tickets/TicketList";
import type { IntCreateTicket } from "../types/ticketingTypes";
import { useUserContext } from "../context/UserContext";

const TicketingPage = (): JSX.Element => {
  const { submitTicketing } = useCreateTicketing();
  const { tickets, isLoading, errorMessage, refetch } = useTicketingGetAll();
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const { user } = useUserContext();
  const currentUserId = user?.id;
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

  return (
    <>
      <PageTitle title="Ticketing" />
      <Container className="xl:!px-16 md:!px-10 sm:!py-12 !px-6 !py-6">
        <TicketingCreateForm onSubmit={handleCreateTicket} />
        <TicketList
          tickets={tickets}
          isLoading={isLoading}
          error={errorMessage}
          onCommentClick={setSelectedTicketId}
        />
        {selectedTicketId !== null && (
          <TicketCommentForm
            onSubmit={
              comments[0]
                ? (text) => editComment(comments[0].id, text)
                : submitComment
            }
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
