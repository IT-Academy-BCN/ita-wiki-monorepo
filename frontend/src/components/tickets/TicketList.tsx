import type { TicketListProps } from "../../types/ticketingTypes";

const formatDate = (date: string) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

const priorityColors: Record<string, string> = {
  baja: "text-emerald-600",
  media: "text-amber-600",
  alta: "text-orange-600",
  critica: "text-red-600",
};

const getPriorityColor = (priority: string) =>
  priorityColors[priority?.toLowerCase()] ?? "text-foreground";

const TicketList = ({ tickets, isLoading, error }: TicketListProps) => {

  if (isLoading) return <p className="text-muted-foreground p-6">Cargando tickets...</p>;
  if (error) return <p className="text-destructive p-6">Error al cargar los tickets</p>;
  if (!tickets || tickets.length === 0) return <p className="text-muted-foreground p-6">No hay tickets</p>;

  return (
    <div className="w-full bg-muted/40 rounded-lg p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-wide text-foreground">TICKETING</h2>
        <p className="mt-4 text-sm font-medium text-foreground underline underline-offset-4">
          Listado de tickets
        </p>
      </div>

      <div role="table" className="w-full">
        <div
          role="row"
          className="hidden sm:grid grid-cols-[1fr_2fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 text-xs font-semibold uppercase text-muted-foreground border-b border-border"
        >
          <div role="columnheader">ID</div>
          <div role="columnheader">Descripción</div>
          <div role="columnheader">Estado</div>
          <div role="columnheader">Fecha</div>
          <div role="columnheader">Prioridad</div>
          <div role="columnheader" className="sr-only">Acciones</div>
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
              <div role="cell" className="truncate">{ticket.description}</div>
              <div role="cell" className="capitalize">{ticket.status}</div>
              <div role="cell">{formatDate(ticket.incident_date)}</div>
              <div role="cell" className={`font-bold ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </div>
              <div role="cell">
                <button className="text-sm text-primary hover:underline">Acciones</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TicketList;