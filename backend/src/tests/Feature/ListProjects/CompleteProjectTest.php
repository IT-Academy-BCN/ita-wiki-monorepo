<?php

declare(strict_types=1);

namespace Tests\Feature\ListProjects;

use App\Models\ListProjects;
use App\Models\User;
use App\Enums\ProjectStatusEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompleteProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_complete_project_successfully(): void
    {
        $owner = User::factory()->create();
        $project = ListProjects::factory()->create([
            'user_id' => $owner->id,
            'status' => ProjectStatusEnum::IN_PROGRESS,
        ]);

        $response = $this->actingAs($owner)
            ->patchJson("/api/codeconnect/{$project->id}/complete", [
                'github_url' => 'https://github.com/user/project',
                'youtube_url' => 'https://youtube.com/watch?v=123',
            ]);

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);

        $this->assertDatabaseHas('list_projects', [
            'id' => $project->id,
            'status' => ProjectStatusEnum::COMPLETED->value,
            'github_url' => 'https://github.com/user/project',
            'youtube_url' => 'https://youtube.com/watch?v=123',
        ]);
    }

    public function test_unauthenticated_user_cannot_complete_project(): void
    {
        $owner = User::factory()->create();
        $project = ListProjects::factory()->create(['user_id' => $owner->id]);

        $response = $this->patchJson("/api/codeconnect/{$project->id}/complete");

        $response->assertStatus(401);
    }

    public function test_non_owner_cannot_complete_project(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $project = ListProjects::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($otherUser)
            ->patchJson("/api/codeconnect/{$project->id}/complete");

        $response->assertStatus(403)
            ->assertJson(['message' => 'You are not the owner of this project']);
    }

    public function test_nonexistent_project_returns_404(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->patchJson('/api/codeconnect/99999/complete');

        $response->assertStatus(404)
            ->assertJson(['message' => 'Project not found']);
    }

    public function test_already_completed_project_returns_422(): void
    {
        $owner = User::factory()->create();
        $project = ListProjects::factory()->create([
            'user_id' => $owner->id,
            'status' => ProjectStatusEnum::COMPLETED,
        ]);

        $response = $this->actingAs($owner)
            ->patchJson("/api/codeconnect/{$project->id}/complete");

        $response->assertStatus(422)
            ->assertJson([
                'message' => "Project must be in 'in_progress' status to mark it as completed"
            ]);
    }

    public function test_invalid_url_returns_422(): void
    {
        $owner = User::factory()->create();
        $project = ListProjects::factory()->create(['user_id' => $owner->id]);

        $response = $this->actingAs($owner)
            ->patchJson("/api/codeconnect/{$project->id}/complete", [
                'github_url' => 'not-a-valid-url',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['github_url']);
    }
}
