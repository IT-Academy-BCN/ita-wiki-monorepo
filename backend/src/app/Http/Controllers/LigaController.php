<?php

declare(strict_types=1);

namespace App\Http\Controllers;


use App\Models\Liga;
use App\Models\User;
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

