<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\ContributorStatusEnum;
use App\Models\ContributorListProject;
use Illuminate\Http\Request;

class JoinProjectController extends Controller
{
    public function __invoke(Request $request, int $listProjectId)
    {
        $validatedData = $request->validate([
            'programming_role' => ['required', 'string', 'in:Frontend Developer,Backend Developer,Fullstack Developer,Other'],
        ]);

        $contributor = ContributorListProject::create([
            'list_project_id' => $listProjectId,
            'user_id' => auth()->id(),
            'programming_role' => $validatedData['programming_role'],
            'status' => ContributorStatusEnum::Pending->value,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Join request submitted successfully',
            'data' => $contributor
        ], 201);
    }
}
