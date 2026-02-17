<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\ListProjects;
use App\Models\ForumQuestion;
use Laravel\Sanctum\Sanctum;

class ForumQuestionCrudTest extends TestCase
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

    public function test_forum_questions_can_be_listed(): void
    {
        ForumQuestion::factory()->count(3)->create([
            'list_project_id' => $this->project->id,
        ]);

        $response = $this->getJson("/api/codeconnect/{$this->project->id}/forum");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_forum_questions_returns_empty_when_none_exist(): void
    {
        $response = $this->getJson("/api/codeconnect/{$this->project->id}/forum");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [],
            ]);
    }

    public function test_forum_question_can_be_shown(): void
    {
        $question = ForumQuestion::factory()->create([
            'list_project_id' => $this->project->id,
            'user_id' => $this->user->id,
        ]);

        $response = $this->getJson("/api/codeconnect/{$this->project->id}/forum/{$question->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $question->id,
                    'question' => $question->question,
                ],
            ]);
    }

    public function test_unauthenticated_user_can_read_forum_questions(): void
    {
        ForumQuestion::factory()->create([
            'list_project_id' => $this->project->id,
        ]);

        $response = $this->getJson("/api/codeconnect/{$this->project->id}/forum");

        $response->assertStatus(200);
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
    }

    public function test_forum_question_requires_text(): void
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson("/api/codeconnect/{$this->project->id}/forum", [
            'question' => '',
        ]);

        $response->assertStatus(422);
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
        $owner = $this->project->owner;
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
