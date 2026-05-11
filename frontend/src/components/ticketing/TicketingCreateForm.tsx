import { FormEvent, JSX, useState } from "react";
import type { IntCreateTicket } from "../../types/ticketingTypes";

type TicketingCreateFormProps = {
  onSubmit: (payload: IntCreateTicket) => void | Promise<void>;
  isLoading?: boolean;
  error?: Error | null;
};

export const TicketingCreateForm = ({
  onSubmit,
  isLoading,
  error,
}: TicketingCreateFormProps): JSX.Element => {
  const [description, setDescription] = useState<string>("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (!description.trim()) return;
    await onSubmit({ description: description.trim() });
    setDescription("");
  };

  return (
    <form className="mt-8" onSubmit={handleSubmit}>
      <h3 className="mb-6 text-sm font-bold text-black underline">
        Crear ticket
      </h3>
      <div className="grid gap-6 md:grid-cols-[minmax(0,410px)_auto] md:items-center">
        <textarea
          className="h-[60px] resize-none border border-gray-600 px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          placeholder="Descripció..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="w-fit bg-[#B91879] px-10 py-4 text-sm font-bold text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creant..." : "Crear ticket"}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </form>
  );
};
