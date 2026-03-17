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

class TicketController extends Controller{

    public function index(): JsonResponse{

        $tickets = Ticket::with(['codeConnect', 'assignee', 'closedBy'])->get();

        return response()->json([
            'success' => true,
            'data' => $tickets
        ]);
    }

    public function show($id): JsonResponse{

        $ticket = Ticket::with(['codeConnect', 'assignee', 'closedBy', 'comments.user'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $ticket
        ], 200);
    }

    public function store(CreateTicketRequest $request): JsonResponse{

        $ticket = Ticket::create([
            ...$request->validated(),
            'code_connect_id' => auth()->id(),
        ]);


        return response()->json([
            'success' => true,
            'message' => 'The Ticket has been created correctly',
            'data' => $ticket
        ], 201);
    }

    public function update(UpdateTicketRequest $request, $id): JsonResponse{

        $ticket = Ticket::findOrFail($id);

        $ticket->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'The Ticket has been updated correctly',
            'data' => $ticket->fresh(['codeConnect', 'assignee', 'closedBy'])
        ], 200);
    }

    public function destroy($id): JsonResponse{

        $ticket = Ticket::findOrFail($id);

        $ticket->delete();

        return response()->json([
            'success' => true,
            'message' => 'The Ticket has been removed',
        ], 200);
    }

    public function updateStatus(UpdateStatusTicketRequest $request, $id): JsonResponse{

        $ticket = Ticket::findOrFail($id);

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

    public function updatePriority(UpdatePriorityRequest $request, $id): JsonResponse{

        $ticket = Ticket::findOrFail($id);

        $ticket->update(['priority' => $request->validated()['priority']]);

        return response()->json([
            'success' => true,
            'message' => 'The Ticket priority has been updated correctly',
            'data' => $ticket->fresh(['codeConnect', 'assignee', 'closedBy'])
        ], 200);
    }

    public function updateAssignee(AssignTicketRequest $request, $id): JsonResponse{

        $ticket = Ticket::findOrFail($id);

        $ticket->update(['assignee_id' => $request->validated()['assignee_id']]);

        return response()->json([
            'success' => true,
            'message' => 'The Ticket has been assigned correctly',
            'data' => $ticket->fresh(['codeConnect', 'assignee', 'closedBy'])
        ], 200);
    }
}
?>
