<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use App\Http\Requests\Tickets\CreateTicketRequest;
use App\Http\Requests\Tickets\UpdateTicketRequest;
use App\Http\Requests\Tickets\UpdateStatusTicketRequest;
use Illuminate\Http\JsonResponse;

class TicketController extends Controller{

    public function index(){

        $tickets = Ticket::all();

        return response()->json([
            'success' => true,
            'data' => $tickets
        ]);
    }

    public function show($id): JsonResponse{

        $ticket = Ticket::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $ticket
        ], 200);
    }

    public function store(CreateTicketRequest $request): JsonResponse{

        $ticket = Ticket::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'The Ticket has been created correctly',
            'data' => $ticket
        ], 200);
    }

    public function update(UpdateTicketRequest $request, $id): JsonResponse{

        $ticket = Ticket::findOrFail($id);

        $ticket->update($request->validated($id));

        return response()->json([
            'success' => true,
            'message' => 'The Ticket has been updated correctly',
            'data' => $ticket
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

        $ticket->update(['status' => $request->validated()['status']]);

        return response()->json([
            'success' => true,
            'message' => 'The Ticket status has been updated correctly',
            'data' => $ticket
        ], 200);
    }

    public function updatePriority(Request $request, $id): JsonResponse{

        $ticket = Ticket::findOrFail($id);

        $request->validate([
            'priority' => 'required|in:low,medium,high'
        ]);

        $ticket->update(['priority' => $request->validated()['priority']]);

        return response()->json([
            'success' => true,
            'message' => 'The Ticket priority has been updated correctly',
            'data' => $ticket
        ], 200);
    }

    public function assign(Request $request, $id): JsonResponse{

        $ticket = Ticket::findOrFail($id);

        $request->validate([
            'assignee_id' => 'required|integer|exists:users,id'
        ]);

        $ticket->update(['assignee_id' => $request->validated()['assignee_id']]);

        return response()->json([
            'success' => true,
            'message' => 'The Ticket has been assigned correctly',
            'data' => $ticket
        ], 200);
    }
}
?>
