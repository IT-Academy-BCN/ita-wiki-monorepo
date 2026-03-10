<?php

declare(strict_types=1);

namespace Tests\Feature\ResourceTests;

use Tests\TestCase;
use App\Models\User;
use App\Models\Resource;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class DeleteResourceTest extends TestCase
{
    use RefreshDatabase;

    private function authenticateSanctumUserWithGithubId(int $githubId): User
    {
        $user = User::factory()->create(['github_id' => $githubId]);
        $user->assignRole('student');
        Sanctum::actingAs($user, ['*']);

        return $user;
    }

    // ========== SUCCESS TESTS ==========

    public function test_owner_can_delete_their_resource(): void
    {
        $githubId = 123456;
        $this->authenticateSanctumUserWithGithubId($githubId);
        $resource = Resource::factory()->create(['github_id' => $githubId]);

        $response = $this->deleteJson(route('resources.destroy', $resource->id));

        $response->assertStatus(200)
            ->assertJson(['message' => 'Resource deleted successfully']);

        $this->assertDatabaseMissing('resources', ['id' => $resource->id]);
    }

    // ========== AUTHORIZATION TESTS ==========

    public function test_non_owner_cannot_delete_resource(): void
    {
        $this->authenticateSanctumUserWithGithubId(111111);
        $resource = Resource::factory()->create(['github_id' => 222222]);

        $response = $this->deleteJson(route('resources.destroy', $resource->id));

        $response->assertStatus(403);

        $this->assertDatabaseHas('resources', ['id' => $resource->id]);
    }

    public function test_unauthenticated_user_cannot_delete_resource(): void
    {
        $resource = Resource::factory()->create();

        $response = $this->deleteJson(route('resources.destroy', $resource->id));

        $response->assertStatus(401);
    }

    public function test_returns_404_when_resource_not_found(): void
    {
        $this->authenticateSanctumUserWithGithubId(123456);

        $response = $this->deleteJson(route('resources.destroy', 99999));

        $response->assertStatus(404);
    }
}
