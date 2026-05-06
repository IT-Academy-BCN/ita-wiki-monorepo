import { FormEvent, JSX, useState } from "react";

import type {
  AffectedApp,
  AffectedFunction,
  TicketType,
} from "../../types/ticketingTypes";

interface TicketingCreatePayload {
  forum_answer_id: number | null;
  assignee_id: number | null;
  name: string;
  incident_date: string;
  affected_app: AffectedApp;
  type: TicketType;
  affected_function: AffectedFunction;
  description: string;
}

type TicketingCreateFormProps = {
  onSubmit: (payload: TicketingCreatePayload) => void | Promise<void>;
};

const createCurrentDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const TicketingCreateForm = ({
  onSubmit,
}: TicketingCreateFormProps): JSX.Element => {
  const [name, setName] = useState<string>("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    await onSubmit({
      forum_answer_id: null,
      assignee_id: null,
      name: name.trim(),
      incident_date: createCurrentDate(),
      affected_app: "wiki_frontend",
      type: "error",
      affected_function: "other",
      description: name.trim(),
    });

    setName("");
  };

  return (
    <form className="mt-8" onSubmit={handleSubmit}>
      <h3 className="mb-6 text-sm font-bold text-black">Crear ticket</h3>

      <div className="grid gap-6 md:grid-cols-[minmax(0,410px)_auto] md:items-center">
        <label className="sr-only" htmlFor="ticket-name">
          Nom del ticket
        </label>

        <input
          className="min-h-[52px] border border-gray-600 px-4 py-3 text-sm focus:border-[#B91879] focus:outline-none focus:ring-1 focus:ring-[#B91879]"
          id="ticket-name"
          name="ticket-name"
          onChange={(event) => setName(event.target.value)}
          placeholder="Ticket name..."
          type="text"
          value={name}
        />

        <button
          className="w-fit bg-[#B91879] px-10 py-4 text-sm font-bold text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
        >
          Crear ticket
        </button>
      </div>
    </form>
  );
};
