<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TagController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\GitHubAuthController;
use App\Http\Controllers\TechnicalTestController;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ListProjectsController;
use App\Http\Controllers\JoinProjectController;
use App\Http\Controllers\ForumQuestionController;
use App\Http\Controllers\ForumAnswerController;
use App\Http\Controllers\Tickets\TicketController;
use App\Http\Controllers\Tickets\TicketCommentController;
use Illuminate\Http\Request;
use App\Http\Controllers\FeatureFlagController;
use App\Http\Controllers\LigaController;

// GitHub Auth System Endpoints (PUBLIC)
Route::get('/auth/github/redirect', [GitHubAuthController::class, 'redirect'])->name('github.redirect');
Route::get('/auth/github/callback', [GitHubAuthController::class, 'callback'])->name('github.callback');

// Protected Auth Endpoints (Require Sanctum Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', function (Request $request) {
        return response()->json([
            'success' => true,
            'user' => $request->user()->only(['id', 'github_id', 'github_user_name', 'name', 'email'])
        ]);
    });

    Route::get('/auth/github/user', [GitHubAuthController::class, 'user'])->name('github.user');

    Route::post('/auth/logout', function(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'success' => true,
            'message' => 'Session closed successfully'
        ]);
    });

    Route::put('/feature-flags/role-self-assignment', [FeatureFlagController::class, 'roleSelfAssignment']);
    Route::patch('/users/{user}/role', [UserController::class, 'updateOwnRole'])->name('users.role.update');

});


// ========== TAG ENDPOINTS (JSON-based - PUBLIC for now) ==========
// ⚠️ These are PUBLIC until we decide on authentication strategy
Route::prefix('tags')->group(function () {
    Route::get('/', [TagController::class, 'index'])->name('tags');
    Route::get('/frequency', [TagController::class, 'getTagsFrequency'])->name('tags.frequency');
    Route::get('/category-frequency', [TagController::class, 'getCategoryTagsFrequency'])->name('category.tags.frequency');
    Route::get('/by-category', [TagController::class, 'getCategoryTagsId'])->name('tags.by-category');
});

// ========== LIST PROJECTS ENDPOINTS ==========

// PUBLIC
Route::apiResource('codeconnect', ListProjectsController::class)->only(['index', 'show']);

// PROTECTED
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('codeconnect', ListProjectsController::class)->except(['index', 'show']);
});

// ========== CONTRIBUTORS ENDPOINTS ==========

// PUBLIC
Route::get('/codeconnect/{listProject}/contributors', [ListProjectsController::class, 'getContributors'])->name('contributors.index');

// PROTECTED
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/codeconnect/{listProject}/contributors', [ListProjectsController::class, 'addContributor'])->name('contributors.store');
    Route::delete('/codeconnect/{listProject}/contributors/{contributor}', [ListProjectsController::class, 'removeContributor'])->name('contributors.destroy');
    Route::patch('/codeconnect/{listProject}/contributors/{contributor}/status', [ListProjectsController::class, 'updateContributorStatus'])->name('contributors.update-status');
    Route::post('/codeconnect/{listProject}/join', JoinProjectController::class)->name('codeconnect.join');
});

// ========== FORUM ENDPOINTS ==========

// PUBLIC
Route::get('/codeconnect/{listProject}/forum', [ForumQuestionController::class, 'index'])->name('forum.questions.index');
Route::get('/codeconnect/{listProject}/forum/{question}', [ForumQuestionController::class, 'show'])->name('forum.questions.show');

// PROTECTED
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/codeconnect/{listProject}/forum', [ForumQuestionController::class, 'store'])->name('forum.questions.store');
    Route::put('/codeconnect/{listProject}/forum/{question}', [ForumQuestionController::class, 'update'])->name('forum.questions.update');
    Route::delete('/codeconnect/{listProject}/forum/{question}', [ForumQuestionController::class, 'destroy'])->name('forum.questions.destroy');

    Route::post('/codeconnect/{listProject}/forum/{question}/answers', [ForumAnswerController::class, 'store'])->name('forum.answers.store');
    Route::put('/codeconnect/{listProject}/forum/{question}/answers/{answer}', [ForumAnswerController::class, 'update'])->name('forum.answers.update');
    Route::delete('/codeconnect/{listProject}/forum/{question}/answers/{answer}', [ForumAnswerController::class, 'destroy'])->name('forum.answers.destroy');
});

// ========== RESOURCES ENDPOINTS ==========

// PUBLIC
Route::apiResource('resources', ResourceController::class)->only(['index', 'show']);

// PROTECTED
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('resources', ResourceController::class)->except(['index', 'show']);
});

// TECHNICAL TESTS

//PUBLIC
Route::middleware(['throttle:60,1'])->group(function () {
    Route::apiResource('technical-tests', TechnicalTestController::class)
    ->only(['index', 'show']);
});

//PROTECTED
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function() {
    Route::apiResource('technical-tests', TechnicalTestController::class)
    ->except(['index', 'show']);
});

// EXERCISES ENDPOINTS
Route::middleware(['throttle:60,1'])->group(function () {
    Route::apiResource('exercises', ExerciseController::class);
});

// LIKES ENDPOINTS
Route::post('/likes', [LikeController::class, 'createStudentLike'])->name('like.create');
Route::delete('/likes', [LikeController::class, 'deleteStudentLike'])->name('like.delete');
Route::get('/likes/{github_id}', [LikeController::class, 'getStudentLikes'])->name('likes');

// BOOKMARKS ENDPOINTS
Route::post('/bookmarks', [BookmarkController::class, 'createStudentBookmark'])->name('bookmark.create');
Route::delete('/bookmarks', [BookmarkController::class, 'deleteStudentBookmark'])->name('bookmark.delete');
Route::get('/bookmarks/{github_id}', [BookmarkController::class, 'getStudentBookmarks'])->name('bookmarks');

// USER ENDPOINTS (Empty for now - pending mentor decision)
Route::put('/users/{user}/update-role', [UserController::class, 'updateRole']);
Route::get('/profile', [UserController::class, 'profile']);
Route::get('/users', [UserController::class, 'index']);
Route::delete('/users/{user}', [UserController::class, 'destroy']);

// ROLES ENDPOINTS
Route::prefix('roles')->group(function () {
    Route::get('/', [RoleController::class, 'index'])->name('roles.index');
    Route::post('/assign', [RoleController::class, 'assignRole'])->name('roles.assign');
    Route::get('/users/{user}', [RoleController::class, 'getUserRoles'])->name('roles.user');
});

// ========== BUGS REPORTING TICKETING SYSTEM ==========

Route::middleware('auth:sanctum')->group(function () {
    Route::get('tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::post('tickets', [TicketController::class, 'store'])->name('tickets.store');
    Route::get('tickets/{ticket}', [TicketController::class, 'show'])->name('tickets.show');
    Route::put('tickets/{ticket}', [TicketController::class, 'update'])->name('tickets.update');
    Route::patch('tickets/{ticket}', [TicketController::class, 'update'])->name('tickets.update.patch');
    Route::delete('tickets/{ticket}', [TicketController::class, 'destroy'])->name('tickets.destroy');

    Route::patch('tickets/{ticket}/status', [TicketController::class, 'updateStatus'])->name('tickets.status.update');
    Route::patch('tickets/{ticket}/priority', [TicketController::class, 'updatePriority'])->name('tickets.priority.update');
    Route::patch('tickets/{ticket}/assignee', [TicketController::class, 'updateAssignee'])->name('tickets.assignee');

    Route::get('tickets/{ticket}/comments', [TicketCommentController::class, 'index'])->name('tickets.comments.index');
    Route::post('tickets/{ticket}/comments', [TicketCommentController::class, 'store'])->name('tickets.comments.store');
    Route::put('tickets/{ticket}/comments/{comment}', [TicketCommentController::class, 'update'])->name('tickets.comments.update');
    Route::delete('tickets/{ticket}/comments/{comment}', [TicketCommentController::class, 'destroy'])->name('tickets.comments.destroy');
});

// ========== LIGA ENDPOINTS ==========

Route::get('/ligas/ranking', [LigaController::class, 'ranking'])->name('ligas.ranking');
Route::put('/ligas/{user}/points', [LigaController::class, 'addPoints'])->name('ligas.points.add');
Route::post('/ligas', [LigaController::class, 'store'])->name('ligas.store');
