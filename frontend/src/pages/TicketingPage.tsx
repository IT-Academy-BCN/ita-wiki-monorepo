import { JSX } from "react";
import Container from "../components/ui/Container";
import PageTitle from "../components/ui/PageTitle";
import TicketList from "../components/tickets/TicketList";
import { useTicketingGetAll } from "../hooks/useTicketingGetAll";

const TicketingPage = (): JSX.Element => {
  const { tickets, isLoading, errorMessage } = useTicketingGetAll();

  return (
    <>
      <PageTitle title="Ticketing" />
      <Container className="xl:!px-16 md:!px-10 sm:!py-12 !px-6 !py-6">
        <h2 className="text-[26px] font-bold text-black text-left">
          Ticketing
        </h2>

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
