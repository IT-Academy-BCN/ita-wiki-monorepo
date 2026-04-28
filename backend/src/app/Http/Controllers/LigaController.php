<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Liga;
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
}


