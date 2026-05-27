<?php

declare(strict_types=1);

namespace Tests\Feature\LigaTests;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaEndpointAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_store_liga(): void
    {
        $response = $this->postJson('/api/ligas', ['user_id' => 1]);

        $response->assertStatus(401);
    }

    public function test_unauthenticated_user_cannot_add_points(): void
    {
        $user = User::factory()->create();

        $response = $this->putJson("/api/ligas/{$user->id}/points", ['points' => 10]);

        $response->assertStatus(401);
    }

    public function test_unauthenticated_user_can_access_ranking(): void
    {
        $response = $this->getJson('/api/ligas/ranking');

        $response->assertStatus(200);
    }

    public function test_authenticated_user_can_store_liga(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/ligas', ['user_id' => $user->id]);

        $response->assertStatus(201);
    }

    public function test_authenticated_user_can_add_points(): void
    {
        $user = $this->authenticateUserWithRole('mentor');
        Liga::factory()->create(['user_id' => $user->id]);

        $this->putJson("/api/ligas/{$user->id}/points", ['points' => 10])
            ->assertStatus(200);
    }

    public function test_student_cannot_add_points(): void
    {
        $student = $this->authenticateUserWithRole('student');
        Liga::factory()->create(['user_id' => $student->id]);

        $this->putJson("/api/ligas/{$student->id}/points")
            ->assertStatus(403);
    }

    public function test_mentor_can_add_points(): void
    {
        $mentor = $this->authenticateUserWithRole('mentor');
        Liga::factory()->create(['user_id' => $mentor->id]);

        $this->putJson("/api/ligas/{$mentor->id}/points")
            ->assertStatus(200);
    }



}
