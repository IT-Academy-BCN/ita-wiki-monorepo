import { useState } from "react";
import { useCreateTicketing } from "../../hooks/useCreateTicketing";
import ButtonComponent from "../atoms/ButtonComponent";
import { IntCreateTicket } from "../../types/ticketingTypes";

export const CreateTicketForm = () => {
  const [description, setDescription] = useState("");
  const { submitTicketing, isLoading, error } = useCreateTicketing();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) return;

    await submitTicketing({
      description: description.trim(),
    } as IntCreateTicket);

    setDescription("");
  };

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-bold text-black underline">
        Crear ticket
      </h3>

      <form className="flex items-center gap-8" onSubmit={handleSubmit}>
        <textarea
          className="h-[60px] w-[290px] resize-none overflow-hidden border border-gray-600 px-3 py-2 text-sm 
             focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          placeholder="Descripció..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <ButtonComponent
          variant="custom"
          type="submit"
          className="bg-primary text-white font-semibold px-4 h-[36px] hover:opacity-90"
        >
          {isLoading ? "Creant..." : "Crear ticket"}
        </ButtonComponent>
      </form>

      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
};
