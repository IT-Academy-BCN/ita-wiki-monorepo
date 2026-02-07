<?php

declare(strict_types=1);

namespace Tests\Feature\ContributorTests;

use Tests\TestCase;
use App\Models\User;
use App\Models\ListProjects;
use App\Models\ContributorListProject;
use App\Enums\ContributorStatusEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ValidateContributorStatusTest extends TestCase
{
    use RefreshDatabase;

    private ListProjects $project;

    protected function setUp(): void
    {
        parent::setUp();

        $this->project = ListProjects::factory()->create();
    }

    private function createPendingContributor(?User $user = null): ContributorListProject
    {
        $user ??= User::factory()->create();

        return ContributorListProject::factory()->create([
            'list_project_id' => $this->project->id,
            'user_id' => $user->id,
            'status' => ContributorStatusEnum::Pending->value,
        ]);
    }


    public function test_a_user_cannot_accept_their_own_contributor_request(): void
    {
        $user = User::factory()->create();

        ContributorListProject::factory()->create([
            'list_project_id' => $this->project->id,
            'user_id' => $user->id,
            'status' => ContributorStatusEnum::Accepted->value,
        ]);

        $pendingContributor = $this->createPendingContributor($user);

        $response = $this->actingAs($user, 'sanctum')
            ->patchJson("/api/codeconnect/{$this->project->id}/contributors/{$pendingContributor->id}/status", [
                'status' => ContributorStatusEnum::Accepted->value,
            ]);

        $response->assertStatus(403)
            ->assertJson([
                'error' => 'You cannot validate your own request',
            ]);

        $this->assertDatabaseHas('contributors_list_project', [
            'id' => $pendingContributor->id,
            'status' => ContributorStatusEnum::Pending->value,
        ]);
    }

    public function test_it_does_not_allow_validating_a_contributor_with_pending_status(): void
    {
        $validator = User::factory()->create();
        $contributorUser = User::factory()->create();

        ContributorListProject::factory()->create([
            'list_project_id' => $this->project->id,
            'user_id' => $validator->id,
            'status' => ContributorStatusEnum::Accepted->value,
        ]);

        $pendingContributor = $this->createPendingContributor($contributorUser);

        $response = $this->actingAs($validator, 'sanctum')
            ->patchJson("/api/codeconnect/{$this->project->id}/contributors/{$pendingContributor->id}/status", [
                'status' => ContributorStatusEnum::Pending->value,
            ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Status must be accepted or rejected',
            ]);

        $this->assertDatabaseHas('contributors_list_project', [
            'id' => $pendingContributor->id,
            'status' => ContributorStatusEnum::Pending->value,
        ]);
    }
    public function test_only_acepted_contributors_can_validate_requests(){
        $nonMemberUser = User::factory()->create();
        $contributorUser = User::factory()->create();
        $pendingContributor = $this->createPendingContributor($contributorUser);

        $response = $this->actingAs($nonMemberUser, 'sanctum')
            ->patchJson("/api/codeconnect/{$this->project->id}/contributors/{$pendingContributor->id}/status", [
                'status' => ContributorStatusEnum::Accepted->value,
            ]);
        
        $response->assertStatus(403)
            ->assertJson([
                'error' => 'You cannot validate this request',
            ]);

        $this->assertDatabaseHas('contributors_list_project', [
            'id' => $pendingContributor->id,
            'status' => ContributorStatusEnum::Pending->value,
        ]);
    }
}
