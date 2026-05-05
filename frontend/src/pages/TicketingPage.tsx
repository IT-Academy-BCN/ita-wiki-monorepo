import { JSX } from "react";

import type { IntCreateTicket } from "../types/ticketingTypes";

import { useCreateTicketing } from "../hooks/useCreateTicketing";
import { useTicketingGetAll } from "../hooks/useTicketingGetAll";

import Container from "../components/ui/Container";
import PageTitle from "../components/ui/PageTitle";
import { TicketingCreateForm } from "../components/ticketing/TicketingCreateForm";
import TicketList from "../components/tickets/TicketList";

const TicketingPage = (): JSX.Element => {
  const { tickets, isLoading, errorMessage } = useTicketingGetAll();
  const { submitTicketing } = useCreateTicketing();

  const handleCreateTicket = async (
    ticketData: IntCreateTicket,
  ): Promise<void> => {
    await submitTicketing(ticketData);
  };

  return (
    <>
      <PageTitle title="Ticketing" />
      <Container className="xl:!px-16 md:!px-10 sm:!py-12 !px-6 !py-6">
        <h2 className="text-[26px] font-bold text-black text-left">
          Ticketing
        </h2>

        <TicketList
          error={errorMessage}
          isLoading={isLoading}
          tickets={tickets}
        />
        <TicketingCreateForm onSubmit={handleCreateTicket} />
      </Container>
    </>
  );
};

export default TicketingPage;
