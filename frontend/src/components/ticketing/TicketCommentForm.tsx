import { useState } from "react";

type Props = {
  onSubmit: (comment: string) => Promise<void>;
  error: string | null;
};

const TicketCommentForm = ({ onSubmit, error }: Props) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await onSubmit(comment);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
      />
      <button type="submit">Send</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default TicketCommentForm;
