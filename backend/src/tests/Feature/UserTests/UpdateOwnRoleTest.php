<?php

declare(strict_types=1);

namespace Tests\Feature\UserTests;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class UpdateOwnRoleTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_update_own_role(): void
    {
        $user = User::factory()->create();
        $user->assignRole('student');
        Sanctum::actingAs($user);

        $response = $this->patchJson('/api/users/me/update-role', [
            'role' => 'mentor',
        ]);
        
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Role updated successfully',
                'role' => [
                    'github_id' => $user->github_id,
                    'role' => 'mentor',
                ],
            ]);

        $this->assertTrue($user->fresh()->hasRole('mentor'));
        $this->assertFalse($user->fresh()->hasRole('student'));
    }

    public function test_unauthenticated_user_cannot_update_role(): void
    {
        $response = $this->patchJson('/api/users/me/update-role', [
            'role' => 'mentor',
        ]);

        $response->assertStatus(401);
    }

    public function test_role_field_is_required(): void
    {
        $user = User::factory()->create();
        $user->assignRole('student');
        Sanctum::actingAs($user);

        $response = $this->patchJson('/api/users/me/update-role', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['role']);
    }

    public function test_invalid_role_is_rejected(): void
    {
        $user = User::factory()->create();
        $user->assignRole('student');
        Sanctum::actingAs($user);

        $response = $this->patchJson('/api/users/me/update-role', [
            'role' => 'supervillain',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['role']);
    }

    public function test_all_valid_roles_are_accepted(): void
    {
        foreach (['student', 'mentor', 'admin', 'superadmin'] as $role) {
            $user = User::factory()->create();
            $user->assignRole('student');
            Sanctum::actingAs($user);

            $response = $this->patchJson('/api/users/me/update-role', [
                'role' => $role,
            ]);
            
            $response->assertStatus(200);
        }
    }
}
