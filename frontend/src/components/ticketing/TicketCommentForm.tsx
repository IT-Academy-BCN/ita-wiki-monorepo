import { useState } from "react";

type Props = {
  onSubmit: (comment: string) => Promise<void>;
  onClose: () => void;
  error: string | null;
  initialValue?: string;
  authorId?: number;
  date?: string;
};

const TicketCommentForm = ({
  onSubmit,
  onClose,
  error,
  initialValue,
  authorId,
  date,
}: Props) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await onSubmit(comment);
    setComment("");
  };

  const textareaClass =
    "h-[60px] w-full max-w-[410px] resize-none border border-gray-600 px-4 py-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]";

  return (
    <form className="mt-8" onSubmit={handleSubmit}>
      <h3 className="mb-4 text-sm font-bold text-black underline">Comentari</h3>
      {initialValue ? (
        <>
          <textarea
            className={`${textareaClass} bg-gray-50`}
            value={initialValue}
            readOnly
          />
          {(authorId || date) && (
            <p className="mt-1 text-xs text-gray-500">
              ID: {authorId} · {date}
            </p>
          )}
        </>
      ) : (
        <textarea
          className={textareaClass}
          placeholder="Escriu un comentari..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      )}
      <div className="mt-4 flex gap-2">
        {!initialValue && (
          <button
            className="bg-[#B91879] px-10 py-4 text-sm font-bold text-white hover:shadow-md"
            type="submit"
          >
            Desar
          </button>
        )}
        <button
          className="border border-gray-600 px-10 py-4 text-sm font-bold text-gray-600 hover:shadow-md"
          type="button"
          onClick={onClose}
        >
          Tanca
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </form>
  );
};

export default TicketCommentForm;
