<?php

declare(strict_types=1);

namespace App\Http\Controllers;
use App\Models\Liga;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LigaController extends Controller
{
    public function addPoints(Request $request, User $user): JsonResponse
    {
       if (!$request->user()) {
        return response()->json(['error' => 'Unauthorized'], 401);
       }

       $entry = Liga::where('user_id', $user->id)->first();

       if (!$entry) {
        return response()->json(['error' => 'No liga entry found for this user'], 404);
       }

       $entry->increment('points', 5);

        return response()->json([
            'user_id' => $user->id,
            'points'  => $entry->fresh()->points,
        ]);

    }
}