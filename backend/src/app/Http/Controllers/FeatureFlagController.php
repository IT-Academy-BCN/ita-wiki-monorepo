<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeatureFlagController extends Controller
{
    public function roleSelfAssignment(Request $request): JsonResponse
    {
        $request->validate([
            'github_id' => 'required|integer',
            'role' => 'required|string|in:student,mentor,admin,superadmin',
        ]);

        $user = User::where('github_id', $request->github_id)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->syncRoles([$request->role]);

        return response()->json([
            'message' => 'Role updated successfully',
            'role' => [
                'github_id' => $user->github_id,
                'role' => $request->role,
            ]
        ]);
    }
}