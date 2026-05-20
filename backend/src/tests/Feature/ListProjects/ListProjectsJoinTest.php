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
}
