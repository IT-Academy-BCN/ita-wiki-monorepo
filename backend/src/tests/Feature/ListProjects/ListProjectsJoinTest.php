<?php
declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\ListProjects;
use Laravel\Sanctum\Sanctum;
use App\Enums\ContributorStatusEnum;
use Spatie\Permission\Models\Role;

class ListProjectsJoinTest extends TestCase
{
    use RefreshDatabase;

    protected User $owner;
    protected User $student;
    protected ListProjects $project;

    public function setUp(): void
    {
        parent::setUp();

        Role::create(['name' => 'student']);
        Role::create(['name' => 'mentor']);

        $this->owner = User::factory()->create();
        $this->project = ListProjects::factory()->create(['user_id' => $this->owner->id]);

        $this->student = User::factory()->create();
        $this->student->assignRole('student');
    }

    public function test_join_requires_authentication(): void
    {
        $response = $this->postJson("/api/codeconnect/{$this->project->id}/join", [
            'programming_role' => 'Backend Developer',
        ]);

        $response->assertStatus(401);
        $response->assertJson(['message' => 'Unauthenticated.']);
    }

    public function test_non_student_cannot_join(): void
    {
        $mentor = User::factory()->create();
        $mentor->assignRole('mentor');
        Sanctum::actingAs($mentor);

        $response = $this->postJson("/api/codeconnect/{$this->project->id}/join", [
            'programming_role' => 'Backend Developer',
        ]);

        $response->assertStatus(403);
        $response->assertJsonFragment(['message' => 'Only students can join projects']);
    }

    public function test_owner_cannot_join_own_project(): void
    {
        $studentOwner = User::factory()->create();
        $studentOwner->assignRole('student');
        $ownedProject = ListProjects::factory()->create(['user_id' => $studentOwner->id]);

        Sanctum::actingAs($studentOwner);

        $response = $this->postJson("/api/codeconnect/{$ownedProject->id}/join", [
            'programming_role' => 'Backend Developer',
        ]);

        $response->assertStatus(400);
        $response->assertJsonFragment(['message' => 'Project owner cannot join as contributor']);
    }

    public function test_cannot_join_twice(): void
    {
        Sanctum::actingAs($this->student);

        $this->postJson("/api/codeconnect/{$this->project->id}/join", [
            'programming_role' => 'Backend Developer',
        ]);

        $response = $this->postJson("/api/codeconnect/{$this->project->id}/join", [
            'programming_role' => 'Frontend Developer',
        ]);

        $response->assertStatus(400);
        $response->assertJsonFragment(['message' => 'You are already a member or have a pending request']);
    }

    public function test_student_can_join_project(): void
    {
        Sanctum::actingAs($this->student);

        $response = $this->postJson("/api/codeconnect/{$this->project->id}/join", [
            'programming_role' => 'Backend Developer',
        ]);

        $response->assertStatus(201);
        $response->assertJsonFragment([
            'success' => true,
            'message' => 'Join request submitted successfully',
        ]);

        $this->assertDatabaseHas('contributors_list_project', [
            'list_project_id' => $this->project->id,
            'user_id' => $this->student->id,
            'status' => ContributorStatusEnum::Pending->value,
        ]);
    }

    public function test_join_nonexistent_project(): void
    {
        Sanctum::actingAs($this->student);

        $response = $this->postJson('/api/codeconnect/99999/join', [
            'programming_role' => 'Backend Developer',
        ]);

        $response->assertStatus(404);
        $response->assertJsonFragment(['message' => 'Project not found']);
    }
}
