<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Liga;
use App\Models\LigaPointHistory;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LigaController extends Controller
{
    public function __construct()
    {
    $this->middleware('check.permission:add liga points')->only(['addPoints']);
    }


    public function index()
    {
        $entries = Liga::with('user')
            ->orderBy('points_weekly', 'desc')
            ->get()
            ->groupBy('league_id')
            ->map(fn ($group) => $group->values()->map(fn ($entry, $index) => [
                'position'      => $index + 1,
                'user_id'       => $entry->user_id,
                'username'      => $entry->user->github_user_name,
                'points_weekly' => $entry->points_weekly,
                'league_id'     => $entry->league_id,
            ]));

        return response()->json($entries);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        if (Liga::where('user_id', $validated['user_id'])->exists()) {
            return response()->json(['error' => 'Entry already exists for this user'], 409);
        }

        $entry = Liga::create(['user_id' => $validated['user_id'],'league_id' => 1, 'points_weekly' => 0,'points' => 0]);

        return response()->json($entry, 201);
    }

    public function ranking() {
        $entries = Liga::with('user')
            ->orderBy('points', 'desc')
            ->get()
            ->values()
            ->map(fn ($entry, $index) => [
                'position'   => $index + 1,
                'user_id'    => $entry->user_id,
                'points'     => $entry->points,
                'username'   => $entry->user->github_user_name,
                'league_id'  => $entry->league_id,
                'created_at' => $entry->created_at,
                'updated_at' => $entry->updated_at,

            ]);

        return response()->json($entries);
    }

    public function history(): JsonResponse
    {
        $history = LigaPointHistory::where('user_id', auth()->id())
            ->orderBy('created_at', 'asc')
            ->get(['points', 'activity', 'created_at']);

        return response()->json($history);
    }

    public function addPoints(Request $request, User $user): JsonResponse
    {
        $entry = Liga::where('user_id', $user->id)->first();

        if (!$entry) {
            return response()->json([
                'message' => 'User has not opted in to the liga',
            ], 403);
        }

        $validated = $request->validate([
            'points' => 'nullable|integer|min:1',
        ]);

         $pointsToAdd = $validated['points'] ?? 5;

         $entry->increment('points', $pointsToAdd);
         $entry->increment('points_weekly', $pointsToAdd);

        $entry->refresh();

        return response()->json([
            'user_id'       => $user->id,
            'points'        => $entry->points,
            'points_weekly' => $entry->points_weekly,
        ]);
    }

}

