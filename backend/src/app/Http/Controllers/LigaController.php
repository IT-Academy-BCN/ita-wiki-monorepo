<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LigaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'   => 'required|integer|exists:users,id',
            'league_id' => 'required|integer',
        ]);

        if (Liga::where('user_id', $validated['user_id'])
            ->where('league_id', $validated['league_id'])
            ->exists()
        ) {
            return response()->json([
                'error' => 'Entry already exists for this user in this league'
            ], 409);
        }

        $user = User::findOrFail($validated['user_id']);

        $entry = Liga::create([
            'user_id'       => $user->id,
            'league_id'     => $validated['league_id'],
            'user_name'     => $user->github_user_name ?? $user->name,
            'points'        => 0,
            'points_weekly' => 0,
        ]);

        return response()->json($entry, 201);
    }

    public function ranking()
    {
        return Liga::orderBy('points', 'desc')
            ->get()
            ->values()
            ->map(fn ($e, $i) => [
                'position'      => $i + 1,
                'user_id'       => $e->user_id,
                'user_name'     => $e->user_name,
                'points'        => $e->points,
                'points_weekly' => $e->points_weekly,
                'created_at'    => $e->created_at,
                'updated_at'    => $e->updated_at,
            ]);
    }

    public function addPoints(Request $request, int $userId): JsonResponse
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json([], 404);
        }

        $validated = $request->validate([
            'league_id' => 'required|integer',
            'points'    => 'nullable|integer|min:1',
        ]);

        $entry = Liga::where('user_id', $user->id)
            ->where('league_id', $validated['league_id'])
            ->first();

        if (!$entry) {
            return response()->json([
                'message' => 'User has not opted in to the liga'
            ], 403);
        }

        $points = $validated['points'] ?? 5;

        $entry->increment('points', $points);
        $entry->increment('points_weekly', $points);

        return response()->json([
            'user_id'       => $user->id,
            'points'        => $entry->points,
            'points_weekly' => $entry->points_weekly,
        ]);
    }
}