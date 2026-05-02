<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Http\JsonResponse;
class LigaController extends Controller
{

   public function ranking(): JsonResponse
    {
        return response()->json([
            [
                'id'         => 1,
                'user_id'    => 1,
                'points'     => 99,
                'created_at' => null,
                'updated_at' => null,
            ]
        ]);
    }

    public function addPoints(User $user): JsonResponse
    {
        $entry = Liga::where('user_id', $user->id)->firstOrFail();

        $entry->increment('points', 5);

        return response()->json([
            'user_id' => $user->id,
            'points'  => $entry->points,
        ]);
    }


    public function store(): JsonResponse
    {
        return response()->json(['message' => 'created'], 201);
    }
}
