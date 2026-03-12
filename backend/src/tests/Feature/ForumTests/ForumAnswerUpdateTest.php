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

class ForumAnswerUpdateTest extends TestCase
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
        $this->project = ListProjects::factory()->create(['user_id' => $this->owner->id]);

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

        $this->assertDatabaseHas('forum_answers', [
            'id' => $answer->id,
            'answer' => 'Respuesta editada.',
        ]);
    }

    public function test_forum_answer_owner_cannot_update(): void
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

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'You do not have permission to edit this answer.',
            ]);

        $this->assertDatabaseMissing('forum_answers', [
            'id' => $answer->id,
            'answer' => 'Editado por el owner.',
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

        $this->assertDatabaseMissing('forum_answers', [
            'id' => $answer->id,
            'answer' => 'Intento.',
        ]);
    }
}
