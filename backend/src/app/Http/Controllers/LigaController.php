<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LigaController extends Controller
{
    public function ranking(): JsonResponse
    {
        $entries = Liga::with('user:id,github_user_name,avatar')
            ->orderBy('points', 'desc')
            ->get()
            ->values()
            ->map(fn ($entry, $index) => [
                'position'         => $index + 1,
                'github_user_name' => $entry->user->github_user_name,
                'avatar'           => $entry->user->avatar,
                'points'           => $entry->points,
            ]);

        return response()->json($entries);
    }

    public function addPoints(User $user): JsonResponse
    {
        return response()->json(['user_id' => $user->id, 'points' => 99]);
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json(['message' => 'created'], 201);
    }
}
