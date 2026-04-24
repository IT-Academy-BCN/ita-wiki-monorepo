<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class LigaController extends Controller
{
    public function ranking()
    {
        return response()->json([
            ['position' => 1, 'github_user_name' => 'stub_user', 'avatar' => null, 'points' => 99]

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