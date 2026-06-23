import type { TicketListProps } from "../../types/ticketingTypes";
import TicketRow from "./TicketRow";

const TicketList = ({
  tickets,
  isLoading,
  error,
  onCommentClick,
  onRowClick,
}: TicketListProps) => {
  if (isLoading)
    return <p className="text-muted-foreground p-6">Carregant tickets...</p>;

  if (error) return <p className="text-destructive p-6">{error}</p>;

  if (!tickets || tickets.length === 0)
    return (
      <p className="text-muted-foreground p-6">No hi ha tickets disponibles</p>
    );

  return (
    <div className="w-full bg-muted/40 rounded-lg p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-wide text-foreground">
          TICKETING
        </h2>
        <p className="mt-4 text-sm font-medium text-foreground underline underline-offset-4">
          Llistat de tickets
        </p>
      </div>

      <div role="table" className="w-full">
        <div
          role="row"
          className="hidden sm:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 text-xs font-semibold uppercase text-muted-foreground border-b border-border"
        >
          <div role="columnheader">ID</div>
          <div role="columnheader">Descripció</div>
          <div role="columnheader">Categoria</div>
          <div role="columnheader">Estat</div>
          <div role="columnheader">Prioritat</div>
          <div role="columnheader">Data</div>
          <div role="columnheader">Rol</div>
          <div role="columnheader">Comentari</div>
        </div>

        <div role="rowgroup" className="flex flex-col">
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              onCommentClick={onCommentClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketList;
