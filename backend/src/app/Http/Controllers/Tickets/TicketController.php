<?php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Http\Requests\Tickets\CreateTicketRequest;
use App\Http\Requests\Tickets\UpdateTicketRequest;
use App\Http\Requests\Tickets\UpdateStatusTicketRequest;
use App\Http\Requests\Tickets\UpdatePriorityRequest;
use App\Http\Requests\Tickets\AssignTicketRequest;
use Illuminate\Http\JsonResponse;

class TicketController extends Controller
{
    public function index(): JsonResponse
    {
        $query = Ticket::with(['codeConnect', 'assignee', 'closedBy']);

        if (! auth()->user()->hasAnyRole(['admin', 'superadmin'])) {
            $query->where('code_connect_id', auth()->id());
        }

        return response()->json([
            'success' => true,
            'data' => $query->get()
        ]);
    }

    public function show($id): JsonResponse
    {
        $ticket = Ticket::with(['codeConnect', 'assignee', 'closedBy', 'comments.user'])->findOrFail($id);
        $this->ensureTicketOwnership($ticket);

        return response()->json([
            'success' => true,
            'data' => $ticket
        ], 200);
    }

    public function store(CreateTicketRequest $request): JsonResponse
    {
        $ticket = Ticket::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'The Ticket has been created correctly',
            'data' => $ticket
        ], 201);
    }

    public function update(UpdateTicketRequest $request, $id): JsonResponse
    {
        $ticket = Ticket::findOrFail($id);
        $this->ensureTicketOwnership($ticket);

        $ticket->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'The Ticket has been updated correctly',
            'data' => $ticket->fresh(['codeConnect', 'assignee', 'closedBy'])
        ], 200);
    }

    public function destroy($id): JsonResponse
    {
        $ticket = Ticket::findOrFail($id);
        $this->ensureTicketOwnership($ticket);

        $ticket->delete();

        return response()->json([
            'success' => true,
            'message' => 'The Ticket has been removed',
        ], 200);
    }

    public function updateStatus(UpdateStatusTicketRequest $request, $id): JsonResponse
    {
        $ticket = Ticket::findOrFail($id);
        $this->ensureTicketOwnership($ticket);

        $status = $request->validated()['status'];
        $updateData = ['status' => $status];

        if ($status === 'closed') {
            $updateData['closed_by'] = auth()->id();
            $updateData['closed_at'] = now();
        }

        $ticket->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'The Ticket status has been updated correctly',
            'data' => $ticket->fresh(['codeConnect', 'assignee', 'closedBy'])
        ], 200);
    }

    public function updatePriority(UpdatePriorityRequest $request, $id): JsonResponse
    {
        $ticket = Ticket::findOrFail($id);
        $this->ensureTicketOwnership($ticket);

        $ticket->update(['priority' => $request->validated()['priority']]);

        return response()->json([
            'success' => true,
            'message' => 'The Ticket priority has been updated correctly',
            'data' => $ticket->fresh(['codeConnect', 'assignee', 'closedBy'])
        ], 200);
    }

    public function updateAssignee(AssignTicketRequest $request, $id): JsonResponse
    {
        $ticket = Ticket::findOrFail($id);
        $this->ensureTicketOwnership($ticket);

        $ticket->update(['assignee_id' => $request->validated()['assignee_id']]);

        return response()->json([
            'success' => true,
            'message' => 'The Ticket has been assigned correctly',
            'data' => $ticket->fresh(['codeConnect', 'assignee', 'closedBy'])
        ], 200);
    }

    private function ensureTicketOwnership(Ticket $ticket): void
    {
        if (auth()->user()->hasAnyRole(['admin', 'superadmin'])) {
            return;
        }

        if ((int) $ticket->code_connect_id !== (int) auth()->id()) {
            abort(403, 'Forbidden');
        }
    }
}