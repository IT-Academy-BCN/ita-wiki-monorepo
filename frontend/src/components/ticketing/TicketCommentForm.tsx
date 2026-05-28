import { useState } from "react";

type Props = {
  onSubmit: (comment: string) => Promise<void>;
  onClose: () => void;
  error: string | null;
  initialValue?: string;
};

const TicketCommentForm = ({
  onSubmit,
  onClose,
  error,
  initialValue,
}: Props) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await onSubmit(comment);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit}>
      {initialValue ? (
        <textarea value={initialValue} readOnly />
      ) : (
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribe un comentario..."
        />
      )}
      {!initialValue && <button type="submit">Guardar</button>}
      <button type="button" onClick={onClose}>
        Cerrar
      </button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default TicketCommentForm;
