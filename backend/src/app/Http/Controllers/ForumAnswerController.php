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
    /**
     * @OA\Post(
     *     path="/api/codeconnect/{listProject}/forum/{question}/answers",
     *     summary="Create an answer for a forum question",
     *     tags={"Forum"},
     *     description="Creates a new answer for a specific forum question. Only accepted project members (or the project owner) can reply. Requires authentication (Sanctum).",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="listProject",
     *         in="path",
     *         required=true,
     *         description="Project ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="question",
     *         in="path",
     *         required=true,
     *         description="Forum question ID",
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"answer"},
     *             @OA\Property(property="answer", type="string", maxLength=1000, example="You can deploy using Docker and Nginx...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Created",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object"),
     *             @OA\Property(property="message", type="string", example="Answer added successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Only accepted project members can reply.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation Error / Limit reached",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="This question has reached the limit of 10 answers.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Not Found",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Question not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function store(Request $request, ListProjects $listProject, ForumQuestion $question): JsonResponse
    {
        // Recommended safety check: ensure the question belongs to the project in the URL
        if ((int) $question->list_project_id !== (int) $listProject->id) {
            return response()->json([
                'success' => false,
                'message' => 'Question not found',
            ], 404);
        }

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

    /**
     * @OA\Put(
     *     path="/api/codeconnect/{listProject}/forum/{question}/answers/{answer}",
     *     summary="Update an answer",
     *     tags={"Forum"},
     *     description="Updates an existing answer. Only the answer author or the project owner can update it. Requires authentication (Sanctum).",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="listProject",
     *         in="path",
     *         required=true,
     *         description="Project ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="question",
     *         in="path",
     *         required=true,
     *         description="Forum question ID",
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\Parameter(
     *         name="answer",
     *         in="path",
     *         required=true,
     *         description="Forum answer ID",
     *         @OA\Schema(type="integer", example=50)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"answer"},
     *             @OA\Property(property="answer", type="string", maxLength=1000, example="Updated answer content...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object"),
     *             @OA\Property(property="message", type="string", example="Answer updated successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="You do not have permission to edit this answer.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Not Found",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Answer not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation Error"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function update(Request $request, ListProjects $listProject, ForumQuestion $question, ForumAnswer $answer): JsonResponse
    {
        // Recommended safety checks: ensure IDs belong together
        if ((int) $question->list_project_id !== (int) $listProject->id) {
            return response()->json([
                'success' => false,
                'message' => 'Question not found',
            ], 404);
        }

        if ((int) $answer->forum_question_id !== (int) $question->id) {
            return response()->json([
                'success' => false,
                'message' => 'Answer not found',
            ], 404);
        }

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

    /**
     * @OA\Delete(
     *     path="/api/codeconnect/{listProject}/forum/{question}/answers/{answer}",
     *     summary="Delete an answer",
     *     tags={"Forum"},
     *     description="Deletes an answer. Only the answer author or the project owner can delete it. Requires authentication (Sanctum).",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="listProject",
     *         in="path",
     *         required=true,
     *         description="Project ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="question",
     *         in="path",
     *         required=true,
     *         description="Forum question ID",
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\Parameter(
     *         name="answer",
     *         in="path",
     *         required=true,
     *         description="Forum answer ID",
     *         @OA\Schema(type="integer", example=50)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Answer deleted successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="You do not have permission to delete this answer.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Not Found",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Answer not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthenticated",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function destroy(ListProjects $listProject, ForumQuestion $question, ForumAnswer $answer): JsonResponse
    {
        // Recommended safety checks: ensure IDs belong together
        if ((int) $question->list_project_id !== (int) $listProject->id) {
            return response()->json([
                'success' => false,
                'message' => 'Question not found',
            ], 404);
        }

        if ((int) $answer->forum_question_id !== (int) $question->id) {
            return response()->json([
                'success' => false,
                'message' => 'Answer not found',
            ], 404);
        }

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
