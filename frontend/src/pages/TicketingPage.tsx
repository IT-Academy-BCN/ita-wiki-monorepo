import { JSX } from "react";
import Container from "../components/ui/Container";
import PageTitle from "../components/ui/PageTitle";
import { TicketingCreateForm } from "../components/ticketing/TicketingCreateForm";
import { useCreateTicketing } from "../hooks/useCreateTicketing";
import type { IntCreateTicket } from "../types/ticketingTypes";

const TicketingPage = (): JSX.Element => {
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

        <TicketingCreateForm onSubmit={handleCreateTicket} />
      </Container>
    </>
  );
};

export default TicketingPage;
