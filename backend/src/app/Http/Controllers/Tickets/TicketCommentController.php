<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketComment;
use App\Http\Requests\Tickets\CreateCommentRequest;
use App\Http\Requests\Tickets\UpdateCommentRequest;
use Illuminate\Http\JsonResponse;

class TicketCommentController
{
    public function index($ticketId): JsonResponse
    {
        $ticket = Ticket::findOrFail($ticketId);

        $comments = $ticket->comments()->with('user')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $comments
        ], 200);
    }

    public function store(CreateCommentRequest $request, $ticketId): JsonResponse
    {
        $ticket = Ticket::findOrFail($ticketId);

        $isClosingComment = $request->validated()['is_closing_comment'] ?? false;

        $comment = $ticket->comments()->create([
            'user_id' => $request->user()->id,
            'comment' => $request->validated()['comment'],
            'is_closing_comment' => $isClosingComment
        ]);

        if ($isClosingComment) {
            $ticket->update([
                'status' => 'closed',
                'closed_by' => $request->user()->id,
                'closed_at' => now()
            ]);
        }

        $comment->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Comment added successfully',
            'data' => $comment
        ], 201);
    }

    public function update(UpdateCommentRequest $request, $ticketId, $commentId): JsonResponse
    {
        $ticket = Ticket::findOrFail($ticketId);
        $comment = TicketComment::where('ticket_id', $ticket->id)
            ->where('id', $commentId)
            ->firstOrFail();

        if ($comment->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to update this comment'
            ], 403);
        }

        $comment->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Comment updated successfully',
            'data' => $comment->fresh(['user'])
        ], 200);
    }

    public function destroy($ticketId, $commentId): JsonResponse
    {
        $ticket = Ticket::findOrFail($ticketId);
        $comment = TicketComment::where('ticket_id', $ticket->id)
            ->where('id', $commentId)
            ->firstOrFail();

        if ($comment->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to delete this comment'
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully'
        ], 200);
    }
}
?>
