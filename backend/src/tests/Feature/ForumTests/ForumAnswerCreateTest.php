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

class ForumAnswerCreateTest extends TestCase
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

        $this->assertDatabaseHas('forum_answers', [
            'forum_question_id' => $this->question->id,
            'user_id' => $this->owner->id,
            'answer' => 'Respuesta del owner.',
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

        $this->assertDatabaseMissing('forum_answers', [
            'forum_question_id' => $this->question->id,
            'user_id' => $randomUser->id,
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

        $this->assertDatabaseMissing('forum_answers', [
            'forum_question_id' => $this->question->id,
            'user_id' => $pendingUser->id,
        ]);
    }

    public function test_forum_answer_unauthenticated_user_cannot_answer(): void
    {
        $response = $this->postJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers",
            ['answer' => 'Sin login.']
        );

        $response->assertStatus(401);

        $this->assertDatabaseMissing('forum_answers', [
            'answer' => 'Sin login.',
        ]);
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

        $this->assertDatabaseCount('forum_answers', 10);
    }

    public function test_forum_answer_can_answer_when_9_answers_exist(): void
    {
        ForumAnswer::factory()->count(9)->create([
            'forum_question_id' => $this->question->id,
        ]);

        Sanctum::actingAs($this->member);

        $response = $this->postJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers",
            ['answer' => 'Soy la respuesta número 10.']
        );

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Answer added successfully.',
            ]);

        $this->assertDatabaseCount('forum_answers', 10);
    }

    public function test_forum_answer_requires_text(): void
    {
        Sanctum::actingAs($this->member);

        $response = $this->postJson(
            "/api/codeconnect/{$this->project->id}/forum/{$this->question->id}/answers",
            ['answer' => '']
        );

        $response->assertStatus(422);

        $this->assertDatabaseMissing('forum_answers', [
            'forum_question_id' => $this->question->id,
            'user_id' => $this->member->id,
        ]);
    }
}
