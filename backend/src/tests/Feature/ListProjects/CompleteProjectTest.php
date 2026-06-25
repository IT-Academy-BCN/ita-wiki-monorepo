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
}
