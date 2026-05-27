<?php

namespace Tests\Feature\ReportingTickets;

use App\Models\ForumAnswer;
use App\Models\ForumQuestion;
use App\Models\ListProjects;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CreateTicketTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_a_ticket_linked_to_a_forum_answer(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $project = ListProjects::factory()->create();
        $questionUser = User::factory()->create();

        $question = ForumQuestion::factory()->create([
            'list_project_id' => $project->id,
            'user_id' => $questionUser->id,
        ]);

        $forumAnswer = ForumAnswer::factory()->create([
            'forum_question_id' => $question->id,
            'user_id' => $questionUser->id,
        ]);

        $payload = [
            'code_connect_id' => $user->id,
            'forum_answer_id' => $forumAnswer->id,
            'name' => 'Reported forum answer',
            'incident_date' => now()->toDateString(),
            'affected_app' => 'code_connect',
            'type' => 'error',
            'affected_function' => 'code_connect',
            'description' => 'This answer should be reported',
        ];

        $response = $this->postJson('/api/tickets', $payload);

        $response->assertCreated()
            ->assertJson([
                'success' => true,
                'message' => 'The Ticket has been created correctly',
            ]);

        $this->assertDatabaseHas('tickets', [
            'code_connect_id' => $user->id,
            'forum_answer_id' => $forumAnswer->id,
            'name' => 'Reported forum answer',
        ]);
    }

    public function test_it_fails_if_forum_answer_id_does_not_exist(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $payload = [
            'code_connect_id' => $user->id,
            'forum_answer_id' => ForumAnswer::max('id') + 1,
            'name' => 'Reported forum answer',
            'incident_date' => now()->toDateString(),
            'affected_app' => 'code_connect',
            'type' => 'error',
            'affected_function' => 'code_connect',
            'description' => 'This answer should be reported',
        ];

        $response = $this->postJson('/api/tickets', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['forum_answer_id']);
    }
}