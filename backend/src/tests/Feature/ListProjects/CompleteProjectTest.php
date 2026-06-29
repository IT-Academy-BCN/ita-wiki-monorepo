<?php

declare(strict_types=1);

namespace Tests\Feature\ListProjects;

use App\Enums\ProjectStatusEnum;
use App\Models\ListProjects;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompleteProjectTest extends TestCase
{
    use RefreshDatabase;

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
}
