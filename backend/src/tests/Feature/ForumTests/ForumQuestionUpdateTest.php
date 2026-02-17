<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\ListProjects;
use App\Models\ForumQuestion;
use Laravel\Sanctum\Sanctum;

class ForumQuestionUpdateTest extends TestCase
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

    public function test_forum_question_author_can_update(): void
    {
        Sanctum::actingAs($this->user);

        $question = ForumQuestion::factory()->create([
            'list_project_id' => $this->project->id,
            'user_id' => $this->user->id,
        ]);

        $response = $this->putJson("/api/codeconnect/{$this->project->id}/forum/{$question->id}", [
            'question' => 'Pregunta actualizada',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Question updated successfully.',
            ]);

        $this->assertDatabaseHas('forum_questions', [
            'id' => $question->id,
            'question' => 'Pregunta actualizada',
        ]);
    }

    public function test_forum_question_owner_cannot_update(): void
    {
        $owner = $this->project->owner;
        Sanctum::actingAs($owner);

        $question = ForumQuestion::factory()->create([
            'list_project_id' => $this->project->id,
            'user_id' => $this->user->id,
        ]);

        $response = $this->putJson("/api/codeconnect/{$this->project->id}/forum/{$question->id}", [
            'question' => 'Editado por el owner',
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'You do not have permission to edit this question.',
            ]);
    }

    public function test_forum_question_random_user_cannot_update(): void
    {
        $randomUser = User::factory()->create();
        Sanctum::actingAs($randomUser);

        $question = ForumQuestion::factory()->create([
            'list_project_id' => $this->project->id,
            'user_id' => $this->user->id,
        ]);

        $response = $this->putJson("/api/codeconnect/{$this->project->id}/forum/{$question->id}", [
            'question' => 'Intento de editar',
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'You do not have permission to edit this question.',
            ]);
    }
}
