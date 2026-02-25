<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\ListProjects;
use App\Models\ForumQuestion;

class ForumQuestionReadTest extends TestCase
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
}
