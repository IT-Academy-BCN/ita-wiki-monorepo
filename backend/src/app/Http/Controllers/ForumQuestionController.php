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
    /**
     * @OA\Get(
     *     path="/api/codeconnect/{listProject}/forum",
     *     summary="Get all forum questions for a project",
     *     tags={"Forum"},
     *     description="Returns all forum questions for a specific project, including the author and answers (with their authors).",
     *     @OA\Parameter(
     *         name="listProject",
     *         in="path",
     *         required=true,
     *         description="Project ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array", @OA\Items(type="object")),
     *             @OA\Property(property="message", type="string", example="Forum questions retrieved successfully")
     *         )
     *     )
     * )
     */
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
            'message' => 'Forum questions retrieved successfully',
        ], 200);
    }

    /**
     * @OA\Get(
     *     path="/api/codeconnect/{listProject}/forum/{question}",
     *     summary="Get a forum question by ID",
     *     tags={"Forum"},
     *     description="Returns a specific forum question for a project, including the author and answers (with their authors).",
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
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object"),
     *             @OA\Property(property="message", type="string", example="Forum question retrieved successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Not Found",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="Question not found")
     *         )
     *     )
     * )
     */
    public function show(ListProjects $listProject, ForumQuestion $question): JsonResponse
    {
        // Recommended safety check: ensure the question belongs to the project in the URL
        if ((int) $question->list_project_id !== (int) $listProject->id) {
            return response()->json([
                'success' => false,
                'message' => 'Question not found',
            ], 404);
        }

        $question->load([
            'user:id,name',
            'answers.user:id,name',
        ]);

        return response()->json([
            'success' => true,
            'data' => $question,
            'message' => 'Forum question retrieved successfully',
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/api/codeconnect/{listProject}/forum",
     *     summary="Create a new forum question",
     *     tags={"Forum"},
     *     description="Creates a new forum question for a specific project. Requires authentication (Sanctum).",
     *     security={{"sanctum":{}}},
     *     @OA\Parameter(
     *         name="listProject",
     *         in="path",
     *         required=true,
     *         description="Project ID",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"question"},
     *             @OA\Property(property="question", type="string", maxLength=500, example="How do I deploy this project?")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Created",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object"),
     *             @OA\Property(property="message", type="string", example="Question published successfully.")
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

    /**
     * @OA\Put(
     *     path="/api/codeconnect/{listProject}/forum/{question}",
     *     summary="Update a forum question",
     *     tags={"Forum"},
     *     description="Updates a forum question. Only the author can update it. Requires authentication (Sanctum).",
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
     *             required={"question"},
     *             @OA\Property(property="question", type="string", maxLength=500, example="Updated question content...")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="object"),
     *             @OA\Property(property="message", type="string", example="Question updated successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="You do not have permission to edit this question.")
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
    public function update(Request $request, ListProjects $listProject, ForumQuestion $question): JsonResponse
    {
        // Recommended safety check: ensure the question belongs to the project in the URL
        if ((int) $question->list_project_id !== (int) $listProject->id) {
            return response()->json([
                'success' => false,
                'message' => 'Question not found',
            ], 404);
        }

        if (Auth::id() !== $question->user_id) {
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

    /**
     * @OA\Delete(
     *     path="/api/codeconnect/{listProject}/forum/{question}",
     *     summary="Delete a forum question",
     *     tags={"Forum"},
     *     description="Deletes a forum question. Only the author or the project owner can delete it. Requires authentication (Sanctum).",
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
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Question deleted successfully.")
     *         )
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="Forbidden",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="message", type="string", example="You do not have permission to delete this question.")
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
    public function destroy(ListProjects $listProject, ForumQuestion $question): JsonResponse
    {
        // Recommended safety check: ensure the question belongs to the project in the URL
        if ((int) $question->list_project_id !== (int) $listProject->id) {
            return response()->json([
                'success' => false,
                'message' => 'Question not found',
            ], 404);
        }

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
