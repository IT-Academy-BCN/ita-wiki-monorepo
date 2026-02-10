<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\ContributorStatusEnum;
use App\Models\ForumAnswer;
use App\Models\ForumQuestion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForumAnswerController extends Controller
{
    public function store(Request $request, ForumQuestion $question): JsonResponse
    {
        if (!$this->canReplyToQuestion($question)) {
            return response()->json([
                'success' => false,
                'message' => 'Solo los miembros aceptados del proyecto pueden responder.',
            ], 403);
        }

        $answerCount = ForumAnswer::query()
            ->where('forum_question_id', $question->id)
            ->count();

        if ($answerCount >= 10) {
            return response()->json([
                'success' => false,
                'message' => 'Esta pregunta ha alcanzado el limite de 10 respuestas.',
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
            'message' => 'Respuesta anadida correctamente.',
            'data' => $answer,
        ], 201);
    }

    public function update(Request $request, ForumAnswer $answer): JsonResponse
    {
        if (!$this->canManageAnswer($answer)) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para editar esta respuesta.',
            ], 403);
        }

        $validated = $request->validate([
            'answer' => 'required|string|max:1000',
        ]);

        $answer->update($validated);
        $answer->load('user:id,name');

        return response()->json([
            'success' => true,
            'message' => 'Respuesta actualizada correctamente.',
            'data' => $answer,
        ], 200);
    }

    public function destroy(ForumAnswer $answer): JsonResponse
    {
        if (!$this->canManageAnswer($answer)) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para eliminar esta respuesta.',
            ], 403);
        }

        $answer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Respuesta eliminada correctamente.',
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

        if ($user->hasRole(['admin', 'superadmin'])) {
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

        if ($answer->question && $answer->question->project && $answer->question->project->owner_id === $user->id) {
            return true;
        }

        return $user->hasRole(['admin', 'superadmin']);
    }
}
