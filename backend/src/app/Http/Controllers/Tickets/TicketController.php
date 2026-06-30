<?php
declare(strict_types=1);

namespace App\Http\Controllers\Tickets;
use App\Enums\AffectedAppEnum;
use App\Enums\AffectedFunctionEnum;
use App\Enums\TicketCategoryEnum;
use App\Enums\TicketStatusEnum;
use App\Enums\TicketTypeEnum;
use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Http\Requests\Tickets\CreateTicketRequest;
use App\Http\Requests\Tickets\UpdateTicketRequest;
use App\Http\Requests\Tickets\UpdateStatusTicketRequest;
use App\Http\Requests\Tickets\UpdatePriorityRequest;
use App\Http\Requests\Tickets\AssignTicketRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Liga;
use App\Models\LigaPointHistory;

class TicketController extends Controller
{
 public const BUG_BOUNTY_REWARD_POINTS = 15;
  
    public function index(Request $request): JsonResponse
    {
        $query = Ticket::with([
            'codeConnect',
            'assignee',
            'closedBy',
        ])->withCount('comments');

        if (! auth()->user()->hasAnyRole(['admin', 'superadmin'])) {
            $query->where(function ($q) use ($request) {
                $q->where('code_connect_id', auth()->id())
                    ->orWhere('assignee_id', auth()->id());

                if ($request->boolean('include_suggestions')) {
                    $q->orWhere('category', TicketCategoryEnum::Suggestion->value);
                }
            });
        }

        $tickets = $query->get();

        if (auth()->user()->hasAnyRole(['admin' , 'superadmin'])) {
            $tickets->each(function ($ticket) {
                if ($ticket->codeConnect) {
                    $ticket->codeConnect->role = $ticket->codeConnect->getRoleName();
                    $ticket->codeConnect->makeHidden('roles');
                }
            });
        }

        return response()->json([
            'success' => true,
            'data' => $tickets
        ]);
    }

    public function show($id): JsonResponse
    {
        $ticket = Ticket::with(['codeConnect', 'assignee', 'closedBy', 'comments.user'])->findOrFail($id);

        $user = auth()->user();

        $isCreator  = (int) $ticket->code_connect_id === (int) $user->id;
        $isAssignee = (int) $ticket->assignee_id === (int) $user->id;

        if (!$user->hasAnyRole(['admin', 'superadmin']) && !$isCreator && !$isAssignee) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to view this ticket',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $ticket
        ], 200);
    }

    public function store(CreateTicketRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['code_connect_id'] = auth()->id();
        $data['name'] = $data['name'] ?? $data['description'];
        $data['incident_date'] = $data['incident_date'] ?? now()->toDateString();
        $data['affected_app'] = $data['affected_app'] ?? AffectedAppEnum::Other->value;
        $data['type'] = $data['type'] ?? TicketTypeEnum::Error->value;
        $data['affected_function'] = $data['affected_function'] ?? AffectedFunctionEnum::Other->value;
        $data['status'] = TicketStatusEnum::Pending->value;
        unset($data['priority']);

        $ticket = Ticket::create($data);

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
        $user = auth()->user();
        $status = $request->validated()['status'];

        if ($status === 'closed' && !$ticket->canClose($user)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to close this ticket',
            ], 403);
        }

        $updateData = ['status' => $status];

        if ($status === 'closed') {
            $updateData['closed_by'] = auth()->id();
            $updateData['closed_at'] = now();
        } else {
            $updateData['closed_by'] = null;
            $updateData['closed_at'] = null;
        }
        $oldStatus = $ticket->status;
        $ticket->update($updateData);
        if (
            $oldStatus !== TicketStatusEnum::Closed &&
            $status === TicketStatusEnum::Closed->value
        ) {
            $entry = Liga::where('user_id', $ticket->code_connect_id)->first();

            if ($entry) {
            $entry->increment('points', self::BUG_BOUNTY_REWARD_POINTS);
            $entry->increment('points_weekly', self::BUG_BOUNTY_REWARD_POINTS);

            LigaPointHistory::create([
                'user_id' => $ticket->code_connect_id,
                'points' => self::BUG_BOUNTY_REWARD_POINTS,
                'activity' => 'Bug Bounty resolved',
            ]);
            }
        }
        return response()->json([
            'success' => true,
            'message' => 'The Ticket status has been updated correctly',
            'data' => $ticket->fresh(['codeConnect', 'assignee', 'closedBy'])
        ], 200);
    }

    public function updatePriority(UpdatePriorityRequest $request, $id): JsonResponse
    {
        $user = auth()->user();

        if (!$user->hasAnyRole(['admin', 'superadmin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to change ticket priority',
            ], 403);
        }

        $ticket = Ticket::findOrFail($id);

        $ticket->update(['priority' => $request->validated()['priority']]);

        return response()->json([
            'success' => true,
            'message' => 'The Ticket priority has been updated correctly',
            'data' => $ticket->fresh(['codeConnect', 'assignee', 'closedBy'])
        ], 200);
    }

    public function updateAssignee(AssignTicketRequest $request, $id): JsonResponse
    {
        $user = auth()->user();

        if (!$user->hasAnyRole(['admin', 'superadmin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to assign this ticket',
            ], 403);
        }

        $ticket = Ticket::findOrFail($id);

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

        $userId = (int) auth()->id();

        if ((int) $ticket->code_connect_id !== $userId && (int) $ticket->assignee_id !== $userId) {
            abort(403, 'Forbidden');
        }
    }
}
