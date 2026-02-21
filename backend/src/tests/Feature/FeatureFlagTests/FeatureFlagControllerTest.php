<?php

declare(strict_types=1);

namespace Tests\Feature\FeatureFlagTests;

use App\Models\User;
use Tests\TestCase;

class FeatureFlagControllerTest extends TestCase
{
    public function test_user_can_change_role_to_student(): void
    {
        $user = $this->authenticateUserWithRole('mentor');

        $response = $this->putJson('/api/feature-flags/role-self-assignment', [
            'github_id' => $user->github_id,
            'role' => 'student',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Role updated successfully',
                'role' => [
                    'github_id' => $user->github_id,
                    'role' => 'student',
                ]
            ]);

        $this->assertTrue($user->fresh()->hasRole('student'));
    }

    public function test_user_can_change_role_to_mentor(): void
    {
        $user = $this->authenticateUserWithRole('student');

        $response = $this->putJson('/api/feature-flags/role-self-assignment', [
            'github_id' => $user->github_id,
            'role' => 'mentor',
        ]);

        $response->assertStatus(200);
        $this->assertTrue($user->fresh()->hasRole('mentor'));
    }

    public function test_returns_404_for_nonexistent_user(): void
    {
        $this->authenticateUserWithRole('student');

        $response = $this->putJson('/api/feature-flags/role-self-assignment', [
            'github_id' => 999999999,
            'role' => 'student',
        ]);

        $response->assertStatus(404)
            ->assertJson(['error' => 'User not found']);
    }

    public function test_returns_422_for_invalid_role(): void
    {
        $user = $this->authenticateUserWithRole('student');

        $response = $this->putJson('/api/feature-flags/role-self-assignment', [
            'github_id' => $user->github_id,
            'role' => 'invalid_role',
        ]);

        $response->assertStatus(422);
    }

    public function test_role_field_is_required(): void
    {
        $user = $this->authenticateUserWithRole('student');

        $response = $this->putJson('/api/feature-flags/role-self-assignment', [
            'github_id' => $user->github_id,
        ]);

        $response->assertStatus(422);
    }

    public function test_github_id_field_is_required(): void
    {
        $this->authenticateUserWithRole('student');

        $response = $this->putJson('/api/feature-flags/role-self-assignment', [
            'role' => 'student',
        ]);

        $response->assertStatus(422);
    }
}
