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
        return response()->json(['user_id' => $user->id, 'points' => 99]);
    }

    public function store(Request $request): JsonResponse
    {
        return response()->json(['message' => 'created'], 201);
    }
}
