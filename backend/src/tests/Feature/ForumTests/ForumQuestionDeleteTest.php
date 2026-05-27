<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\ListProjects;
use App\Models\ForumQuestion;
use Laravel\Sanctum\Sanctum;

class ForumQuestionDeleteTest extends TestCase
{
    use RefreshDatabase;

    protected $project;
    protected $user;

    public function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->project = ListProjects::factory()->create();
    }

    public function test_forum_question_author_can_delete(): void
    {
        Sanctum::actingAs($this->user);

        $question = ForumQuestion::factory()->create([
            'list_project_id' => $this->project->id,
            'user_id' => $this->user->id,
        ]);

        $response = $this->deleteJson("/api/codeconnect/{$this->project->id}/forum/{$question->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Question deleted successfully.',
            ]);

        $this->assertDatabaseMissing('forum_questions', [
            'id' => $question->id,
        ]);
    }

    public function test_forum_question_owner_can_delete(): void
    {
        $owner = $this->project->user;
        Sanctum::actingAs($owner);

        $question = ForumQuestion::factory()->create([
            'list_project_id' => $this->project->id,
            'user_id' => $this->user->id,
        ]);

        $response = $this->deleteJson("/api/codeconnect/{$this->project->id}/forum/{$question->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseMissing('forum_questions', [
            'id' => $question->id,
        ]);
    }

    public function test_forum_question_random_user_cannot_delete(): void
    {
        $randomUser = User::factory()->create();
        Sanctum::actingAs($randomUser);

        $question = ForumQuestion::factory()->create([
            'list_project_id' => $this->project->id,
            'user_id' => $this->user->id,
        ]);

        $response = $this->deleteJson("/api/codeconnect/{$this->project->id}/forum/{$question->id}");

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
            ]);

        $this->assertDatabaseHas('forum_questions', [
            'id' => $question->id,
        ]);
    }

    public function test_unauthenticated_user_cannot_delete_forum_question(): void
    {
        $question = ForumQuestion::factory()->create([
            'list_project_id' => $this->project->id,
        ]);

        $response = $this->deleteJson("/api/codeconnect/{$this->project->id}/forum/{$question->id}");

        $response->assertStatus(401);
    }
}
