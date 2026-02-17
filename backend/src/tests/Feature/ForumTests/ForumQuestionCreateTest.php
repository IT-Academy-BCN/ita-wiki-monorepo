<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\ListProjects;
use Laravel\Sanctum\Sanctum;

class ForumQuestionCreateTest extends TestCase
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

    public function test_authenticated_user_can_create_forum_question(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson("/api/codeconnect/{$this->project->id}/forum", [
            'question' => 'Como puedo configurar el entorno?',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Question published successfully.',
            ]);

        $this->assertDatabaseHas('forum_questions', [
            'list_project_id' => $this->project->id,
            'user_id' => $this->user->id,
            'question' => 'Como puedo configurar el entorno?',
        ]);
    }

    public function test_unauthenticated_user_cannot_create_forum_question(): void
    {
        $response = $this->postJson("/api/codeconnect/{$this->project->id}/forum", [
            'question' => 'Pregunta sin login',
        ]);

        $response->assertStatus(401);

        $this->assertDatabaseMissing('forum_questions', [
            'question' => 'Pregunta sin login',
        ]);
    }

    public function test_forum_question_requires_text(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson("/api/codeconnect/{$this->project->id}/forum", [
            'question' => '',
        ]);

        $response->assertStatus(422);

        $this->assertDatabaseMissing('forum_questions', [
            'list_project_id' => $this->project->id,
            'user_id' => $this->user->id,
        ]);
    }
}
