<?php

declare(strict_types=1);

namespace Tests\Feature\RoleTests;

use Tests\TestCase;

class RolePermissionTest extends TestCase
{
    public function test_student_can_view_resources(): void
    {
        $this->authenticateUserWithRole('student');

        $response = $this->getJson('/api/resources');

        $response->assertStatus(200);
    }

    public function test_student_cannot_view_users(): void
    {
        $this->authenticateUserWithRole('student');

        $response = $this->getJson('/api/users');

        $response->assertStatus(403);
    }

    public function test_mentor_can_view_users(): void
    {
        $this->authenticateUserWithRole('mentor');

        $response = $this->getJson('/api/users');

        $response->assertStatus(200);
    }

    public function test_admin_can_edit_user_roles(): void
    {
        $admin = $this->authenticateUserWithRole('admin');
        $targetUser = $this->createUserWithRole('student');

        $response = $this->putJson("/api/users/{$targetUser->id}/update-role", [
            'role' => 'mentor',
        ]);

        $response->assertStatus(200);
    }

    public function test_student_cannot_edit_user_roles(): void
    {
        $student = $this->authenticateUserWithRole('student');
        $targetUser = $this->createUserWithRole('student');

        $response = $this->putJson("/api/users/{$targetUser->id}/update-role", [
            'role' => 'mentor',
        ]);

        $response->assertStatus(403);
    }
}
