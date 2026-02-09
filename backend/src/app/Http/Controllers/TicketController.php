<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use App\Http\Requests\Tickets\CreateTicketRequest;
use App\Http\Requests\Tickets\UpdateTicketRequest;
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
            'succes' => true,
            'data' => $ticket
        ], 201);
    }

    public function create(CreateTicketRequest $request): JsonResponse{
        
        $ticket = Ticket::create($request->validated());
    
        return response()->json([
            'success' => true,
            'message' => 'The Ticket has been created correctly',
            'data' => $ticket
        ], 201);
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

    public function delete($id): JsonResponse{

        $ticket = Ticket::findOrFail($id);

        $ticket->delete();

        return response()->json([
            'success' => true,
            'message' => 'The Ticket has been removed',
        ], 200);
    }
}
?>