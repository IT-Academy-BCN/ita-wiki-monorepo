import { JSX } from "react";
import Container from "../components/ui/Container";
import PageTitle from "../components/ui/PageTitle";
import { TicketingCreateForm } from "../components/ticketing/TicketingCreateForm";
import { useCreateTicketing } from "../hooks/useCreateTicketing";
import { useTicketingGetAll } from "../hooks/useTicketingGetAll";
import TicketList from "../components/tickets/TicketList";
import type { IntCreateTicket } from "../types/ticketingTypes";

const TicketingPage = (): JSX.Element => {
  const { submitTicketing } = useCreateTicketing();
  const { tickets, isLoading, errorMessage, refetch } = useTicketingGetAll();

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
        />
      </Container>
    </>
  );
};

export default TicketingPage;
