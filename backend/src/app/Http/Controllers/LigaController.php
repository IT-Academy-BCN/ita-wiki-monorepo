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
            'user_id' => 'required|integer|exists:users,id',
        ]);

        if (Liga::where('user_id', $validated['user_id'])->exists()) {
            return response()->json(['error' => 'Entry already exists for this user'], 409);
        }

        $entry = Liga::create(['user_id' => $validated['user_id'], 'points' => 0]);

        return response()->json($entry, 201);
    }

    public function ranking()
    {
        $entries = Liga::orderBy('points', 'desc')
            ->get()
            ->values()
            ->map(fn ($entry, $index) => [
                'position'   => $index + 1,
                'user_id'    => $entry->user_id,
                'points'     => $entry->points,
                'created_at' => $entry->created_at,
                'updated_at' => $entry->updated_at,
            ]);

        return response()->json($entries);
    }

    public function addPoints(User $user): JsonResponse
    {
        $entry = Liga::where('user_id', $user->id)->first();

        if (!$entry) {
            return response()->json(['message' => 'User has not opted in to the liga'], 403);
        }

        $entry->increment('points', 5);

        return response()->json([
            'user_id' => $user->id,
            'points'  => $entry->points,
        ]);
    }
}
