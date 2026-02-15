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

        $comment = $ticket->comments()->create([
            'user_id' => $request->user()->id,
            'comment' => $request->validated()['comment'],
            'is_closing_comment' => $request->validated()['is_closing_comment'] ?? false
        ]);

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

        $comment->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Comment updated successfully',
            'data' => $comment
        ], 200);
    }

    public function destroy($ticketId, $commentId): JsonResponse
    {
        $ticket = Ticket::findOrFail($ticketId);
        $comment = TicketComment::where('ticket_id', $ticket->id)
            ->where('id', $commentId)
            ->firstOrFail();

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully'
        ], 200);
    }
}
?>
