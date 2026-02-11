<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\ContributorStatusEnum;
use App\Models\ForumAnswer;
use App\Models\ForumQuestion;
use App\Models\ListProjects;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForumAnswerController extends Controller
{
    public function store(Request $request, ListProjects $listProject, ForumQuestion $question): JsonResponse
    {
        if (!$this->canReplyToQuestion($question)) {
            return response()->json([
                'success' => false,
                'message' => 'Only accepted project members can reply.',
            ], 403);
        }

        $answerCount = ForumAnswer::query()
            ->where('forum_question_id', $question->id)
            ->count();

        if ($answerCount >= 10) {
            return response()->json([
                'success' => false,
                'message' => 'This question has reached the limit of 10 answers.',
            ], 422);
        }

        $validated = $request->validate([
            'answer' => 'required|string|max:1000',
        ]);

        $answer = ForumAnswer::query()->create([
            'forum_question_id' => $question->id,
            'user_id' => Auth::id(),
            'answer' => $validated['answer'],
        ]);

        $answer->load('user:id,name');

        return response()->json([
            'success' => true,
            'message' => 'Answer added successfully.',
            'data' => $answer,
        ], 201);
    }

    public function update(Request $request, ListProjects $listProject, ForumQuestion $question, ForumAnswer $answer): JsonResponse
    {
        if (!$this->canManageAnswer($answer)) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to edit this answer.',
            ], 403);
        }

        $validated = $request->validate([
            'answer' => 'required|string|max:1000',
        ]);

        $answer->update($validated);
        $answer->load('user:id,name');

        return response()->json([
            'success' => true,
            'message' => 'Answer updated successfully.',
            'data' => $answer,
        ], 200);
    }

    public function destroy(ListProjects $listProject, ForumQuestion $question, ForumAnswer $answer): JsonResponse
    {
        if (!$this->canManageAnswer($answer)) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to delete this answer.',
            ], 403);
        }

        $answer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Answer deleted successfully.',
        ], 200);
    }

    private function canReplyToQuestion(ForumQuestion $question): bool
    {
        $user = Auth::user();

        if (!$user || !$question->project) {
            return false;
        }

        if ($question->project->owner_id === $user->id) {
            return true;
        }

        return $question->project
            ->contributorListProject()
            ->where('user_id', $user->id)
            ->where('status', ContributorStatusEnum::Accepted->value)
            ->exists();
    }

    private function canManageAnswer(ForumAnswer $answer): bool
    {
        $user = Auth::user();

        if (!$user) {
            return false;
        }

        if ($user->id === $answer->user_id) {
            return true;
        }

        return $answer->question && $answer->question->project && $answer->question->project->owner_id === $user->id;
    }
}
