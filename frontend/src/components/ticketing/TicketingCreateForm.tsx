import { FormEvent, JSX, useState } from "react";
import {
  IntCreateTicket,
  TicketCategoryEnum,
} from "../../types/ticketingTypes";

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

  const [category, setCategory] = useState<TicketCategoryEnum>(
    TicketCategoryEnum.BUG,
  );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!description.trim()) return;

    await onSubmit({
      description: description.trim(),
      category,
    });

    setDescription("");
    setCategory(TicketCategoryEnum.BUG);
  };

  return (
    <form className="mt-8" onSubmit={handleSubmit}>
      <h3 className="mb-6 text-sm font-bold text-black underline">
        Crear tiquet
      </h3>

      <div className="grid gap-6 md:grid-cols-[minmax(0,410px)_180px_auto] md:items-center">
        <textarea
          className="h-[60px] resize-none border border-gray-600 px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          placeholder="Descripció..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="h-[60px] border border-gray-600 px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as TicketCategoryEnum)
          }
        >
          <option value={TicketCategoryEnum.BUG}>Bug</option>

          <option value={TicketCategoryEnum.SUGGESTION}>
            Suggestion
          </option>

          <option value={TicketCategoryEnum.OTHER}>
            Other
          </option>
        </select>

        <button
          className="w-fit bg-[#B91879] px-10 py-4 text-sm font-bold text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Creant..." : "Crear tiquet"}
        </button>
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error.message}
        </p>
      )}
    </form>
  );
};