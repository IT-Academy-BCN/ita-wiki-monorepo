import type {
  TicketListProps,
  TicketPriority,
  TicketStatus,
} from "../../types/ticketingTypes";

const formatDate = (date: string) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const priorityColors: Record<TicketPriority, string> = {
  low: "text-emerald-600",
  medium: "text-amber-600",
  high: "text-orange-600",
  critical: "text-red-600",
};

const priorityLabels: Record<TicketPriority, string> = {
  low: "Baixa",
  medium: "Mitjana",
  high: "Alta",
  critical: "Crítica",
};

const statusLabels: Record<TicketStatus, string> = {
  pending: "Nou",
  in_progress: "En progrés",
  blocked: "Bloquejat",
  ready: "Fet",
  closed: "Tancat",
};

const TicketList = ({
  tickets,
  isLoading,
  error,
  onCommentClick,
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
          className="hidden sm:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 text-xs font-semibold uppercase text-muted-foreground border-b border-border"
        >
          <div role="columnheader">ID</div>
          <div role="columnheader">Descripció</div>
          <div role="columnheader">Estat</div>
          <div role="columnheader">Data</div>
          <div role="columnheader">Prioritat</div>
          <div role="columnheader">Comentari</div>
        </div>

        <div role="rowgroup" className="flex flex-col">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              role="row"
              className="grid grid-cols-2 sm:grid-cols-[1fr_2fr_1fr_1fr_1fr_auto] gap-2 sm:gap-4 px-4 py-4 border-b border-border/60 hover:bg-background/60"
            >
              <div role="cell" className="font-semibold">
                {String(ticket.id).padStart(6, "0")}
              </div>

              <div role="cell" className="truncate">
                {ticket.name}
              </div>

              <div role="cell">
                {statusLabels[ticket.status] ?? ticket.status}
              </div>

              <div role="cell">{formatDate(ticket.incident_date)}</div>

              <div
                role="cell"
                className={`font-bold ${priorityColors[ticket.priority ?? "low"] ?? "text-foreground"}`}
              >
                {priorityLabels[ticket.priority ?? "low"]}
              </div>

              <div role="cell">
                <button onClick={() => onCommentClick?.(ticket.id)}>
                  Comentari
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketList;
