<?php

declare(strict_types=1);

namespace App\Http\Controllers;

<<<<<<< HEAD
use App\Models\Liga;
use App\Models\User;
use Illuminate\Http\JsonResponse;
=======
use App\Models\User;
>>>>>>> 625830ae637dc3e62762701610f05f51027d3cf4

class LigaController extends Controller
{
<<<<<<< HEAD
    public function addPoints(User $user): JsonResponse
    {
        public function ranking()
        {
        return response()->json([
            [
            'id'=> 1,
            'user_id'=> 1,
            'points'=> 99,
            'created_at' => null,
            'updated_at' => null,
            ]
        ]);
        }

        if (!$entry) {
            return response()->json(['error' => 'No liga entry found for this user'], 404);
        }

        $entry->increment('points', 5);

        return response()->json([
            'user_id' => $user->id,
            'points'  => $entry->points,
        ]);

    }
    public function store(Request $request)
    {
        return response()->json(['message' => 'created'], 201);
    }


}
=======
    public function ranking()
    {
        return response()->json([
            [
            'id'=> 1,
            'user_id'=> 1,
            'points'=> 99,
            'created_at' => null,
            'updated_at' => null,
            ]
        ]);
    }

    public function addPoints(User $user)
    {
        return response()->json(['user_id' => $user->id, 'points' => 99]);
    }

    public function store(Request $request)
    {
        return response()->json(['message' => 'created'], 201);
    }
}
>>>>>>> 625830ae637dc3e62762701610f05f51027d3cf4
