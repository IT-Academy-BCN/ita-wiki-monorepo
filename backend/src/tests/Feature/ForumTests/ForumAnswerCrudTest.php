<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\ListProjects;
use App\Models\ForumQuestion;
use App\Models\ForumAnswer;
use App\Models\ContributorListProject;
use App\Enums\ContributorStatusEnum;
use Laravel\Sanctum\Sanctum;

class ForumAnswerCrudTest extends TestCase
{
    use RefreshDatabase;

    protected $project;
    protected $owner;
    protected $member;
    protected $question;

    public function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->project = ListProjects::factory()->create(['owner_id' => $this->owner->id]);

        $this->member = User::factory()->create();
        ContributorListProject::factory()->create([
            'user_id' => $this->member->id,
            'list_project_id' => $this->project->id,
            'status' => ContributorStatusEnum::Accepted->value,
        ]);

        $this->question = ForumQuestion::factory()->create([
            'list_project_id' => $this->project->id,
            'user_id' => $this->owner->id,
        ]);
    }

    public function test_forum_answer_accepted_member_can_answer(): void
    {
        Sanctum::actingAs($this->member);

        $response = $this->postJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers",
            ['answer' => 'Esta es mi respuesta al tema.']
        );

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Answer added successfully.',
            ]);

        $this->assertDatabaseHas('forum_answers', [
            'forum_question_id' => $this->question->id,
            'user_id' => $this->member->id,
        ]);
    }

    public function test_forum_answer_owner_can_answer(): void
    {
        Sanctum::actingAs($this->owner);

        $response = $this->postJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers",
            ['answer' => 'Respuesta del owner.']
        );

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_forum_answer_non_member_cannot_answer(): void
    {
        $randomUser = User::factory()->create();
        Sanctum::actingAs($randomUser);

        $response = $this->postJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers",
            ['answer' => 'Intento de respuesta.']
        );

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Only accepted project members can reply.',
            ]);
    }

    public function test_forum_answer_pending_contributor_cannot_answer(): void
    {
        $pendingUser = User::factory()->create();
        ContributorListProject::factory()->create([
            'user_id' => $pendingUser->id,
            'list_project_id' => $this->project->id,
            'status' => ContributorStatusEnum::Pending->value,
        ]);

        Sanctum::actingAs($pendingUser);

        $response = $this->postJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers",
            ['answer' => 'Soy pending todavia.']
        );

        $response->assertStatus(403);
    }

    public function test_forum_answer_unauthenticated_user_cannot_answer(): void
    {
        $response = $this->postJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers",
            ['answer' => 'Sin login.']
        );

        $response->assertStatus(401);
    }

    public function test_forum_answer_limit_of_10_per_question(): void
    {
        ForumAnswer::factory()->count(10)->create([
            'forum_question_id' => $this->question->id,
        ]);

        Sanctum::actingAs($this->member);

        $response = $this->postJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers",
            ['answer' => 'Ya hay 10 respuestas.']
        );

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'This question has reached the limit of 10 answers.',
            ]);
    }

    public function test_forum_answer_requires_text(): void
    {
        Sanctum::actingAs($this->member);

        $response = $this->postJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers",
            ['answer' => '']
        );

        $response->assertStatus(422);
    }

    public function test_forum_answer_author_can_update(): void
    {
        $answer = ForumAnswer::factory()->create([
            'forum_question_id' => $this->question->id,
            'user_id' => $this->member->id,
        ]);

        Sanctum::actingAs($this->member);

        $response = $this->putJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers/{$answer->id}",
            ['answer' => 'Respuesta editada.']
        );

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Answer updated successfully.',
            ]);
    }

    public function test_forum_answer_owner_can_update(): void
    {
        $answer = ForumAnswer::factory()->create([
            'forum_question_id' => $this->question->id,
            'user_id' => $this->member->id,
        ]);

        Sanctum::actingAs($this->owner);

        $response = $this->putJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers/{$answer->id}",
            ['answer' => 'Editado por el owner.']
        );

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);
    }

    public function test_forum_answer_random_user_cannot_update(): void
    {
        $answer = ForumAnswer::factory()->create([
            'forum_question_id' => $this->question->id,
            'user_id' => $this->member->id,
        ]);

        $randomUser = User::factory()->create();
        Sanctum::actingAs($randomUser);

        $response = $this->putJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers/{$answer->id}",
            ['answer' => 'Intento.']
        );

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_forum_answer_author_can_delete(): void
    {
        $answer = ForumAnswer::factory()->create([
            'forum_question_id' => $this->question->id,
            'user_id' => $this->member->id,
        ]);

        Sanctum::actingAs($this->member);

        $response = $this->deleteJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers/{$answer->id}"
        );

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Answer deleted successfully.',
            ]);

        $this->assertDatabaseMissing('forum_answers', [
            'id' => $answer->id,
        ]);
    }

    public function test_forum_answer_owner_can_delete(): void
    {
        $answer = ForumAnswer::factory()->create([
            'forum_question_id' => $this->question->id,
            'user_id' => $this->member->id,
        ]);

        Sanctum::actingAs($this->owner);

        $response = $this->deleteJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers/{$answer->id}"
        );

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseMissing('forum_answers', [
            'id' => $answer->id,
        ]);
    }

    public function test_forum_answer_random_user_cannot_delete(): void
    {
        $answer = ForumAnswer::factory()->create([
            'forum_question_id' => $this->question->id,
            'user_id' => $this->member->id,
        ]);

        $randomUser = User::factory()->create();
        Sanctum::actingAs($randomUser);

        $response = $this->deleteJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers/{$answer->id}"
        );

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
            ]);

        $this->assertDatabaseHas('forum_answers', [
            'id' => $answer->id,
        ]);
    }

    public function test_forum_answer_unauthenticated_user_cannot_delete(): void
    {
        $answer = ForumAnswer::factory()->create([
            'forum_question_id' => $this->question->id,
        ]);

        $response = $this->deleteJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers/{$answer->id}"
        );

        $response->assertStatus(401);
    }
}
