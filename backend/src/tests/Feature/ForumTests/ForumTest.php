<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\ListProjects;
use App\Models\ForumQuestion;
use App\Models\ForumAnswer;

class ForumTest extends TestCase
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

    public function test_forum_question_can_be_created(): void
    {
        $question = ForumQuestion::factory()->create([
            'list_project_id' => $this->project->id,
            'user_id' => $this->user->id,
        ]);

        $this->assertDatabaseHas('forum_questions', [
            'id' => $question->id,
            'list_project_id' => $this->project->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function test_forum_answer_can_be_created_for_question(): void
    {
        $question = ForumQuestion::factory()->create([
            'list_project_id' => $this->project->id,
            'user_id' => $this->user->id,
        ]);

        $answer = ForumAnswer::factory()->create([
            'forum_question_id' => $question->id,
            'user_id' => $this->user->id,
        ]);

        $this->assertDatabaseHas('forum_answers', [
            'id' => $answer->id,
            'forum_question_id' => $question->id,
            'user_id' => $this->user->id,
        ]);
    }
}
