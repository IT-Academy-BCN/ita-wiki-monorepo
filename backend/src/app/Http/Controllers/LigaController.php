<?php

declare (strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class LigaController extends Controller
{
    public function addPoints(User $user)
    {
        return response()->json(['user_id' => $user->id, 'points' => 99]);
    }
}