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

class ForumAnswerDeleteTest extends TestCase
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
