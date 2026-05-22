import type { TicketComment } from "../../types/ticketingTypes";

type Props = {
  comments: TicketComment[];
};

const TicketCommentList = ({ comments }: Props) => {
  if (comments.length === 0) return <p>No comments yet</p>;

  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>
          <span>{comment.user.name}</span>
          <span>{comment.created_at}</span>
          <p>{comment.comment}</p>
        </li>
      ))}
    </ul>
  );
};

export default TicketCommentList;
