<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\ForumQuestion;
use App\Models\ListProjects;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForumQuestionController extends Controller
{
    public function index(ListProjects $listProject): JsonResponse
    {
        $questions = ForumQuestion::query()
            ->where('list_project_id', $listProject->id)
            ->with([
                'user:id,name',
                'answers.user:id,name',
            ])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $questions,
        ], 200);
    }

    public function show(ListProjects $listProject, ForumQuestion $question): JsonResponse
    {
        $question->load([
            'user:id,name',
            'answers.user:id,name',
        ]);

        return response()->json([
            'success' => true,
            'data' => $question,
        ], 200);
    }

    public function store(Request $request, ListProjects $listProject): JsonResponse
    {
        $validated = $request->validate([
            'question' => 'required|string|max:500',
        ]);

        $question = ForumQuestion::query()->create([
            'list_project_id' => $listProject->id,
            'user_id' => Auth::id(),
            'question' => $validated['question'],
        ]);

        $question->load('user:id,name');

        return response()->json([
            'success' => true,
            'message' => 'Question published successfully.',
            'data' => $question,
        ], 201);
    }

    public function update(Request $request, ListProjects $listProject, ForumQuestion $question): JsonResponse
    {
        if (!$this->canManageQuestion($question)) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to edit this question.',
            ], 403);
        }

        $validated = $request->validate([
            'question' => 'required|string|max:500',
        ]);

        $question->update($validated);
        $question->load('user:id,name');

        return response()->json([
            'success' => true,
            'message' => 'Question updated successfully.',
            'data' => $question,
        ], 200);
    }

    public function destroy(ListProjects $listProject, ForumQuestion $question): JsonResponse
    {
        if (!$this->canManageQuestion($question)) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to delete this question.',
            ], 403);
        }

        $question->delete();

        return response()->json([
            'success' => true,
            'message' => 'Question deleted successfully.',
        ], 200);
    }

    private function canManageQuestion(ForumQuestion $question): bool
    {
        $user = Auth::user();

        if (!$user) {
            return false;
        }

        if ($user->id === $question->user_id) {
            return true;
        }

        return $question->project && $question->project->owner_id === $user->id;
    }
}
