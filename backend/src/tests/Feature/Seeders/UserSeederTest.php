<?php

declare(strict_types=1);

namespace Tests\Feature\Seeders;

use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_seeder_creates_one_user_per_role(): void
    {
        (new UserSeeder())->run();

        foreach (['superadmin', 'admin', 'mentor', 'student'] as $role) {
            $this->assertTrue(
                User::role($role)->exists(),
                "No user found with role: {$role}"
            );
        }
    }

    public function test_user_seeder_is_idempotent(): void
    {
        (new UserSeeder())->run();
        (new UserSeeder())->run();

        $this->assertCount(1, User::where('email', 'superadmin@itawiki.test')->get());
        $this->assertCount(1, User::where('email', 'admin@itawiki.test')->get());
        $this->assertCount(1, User::where('email', 'mentor@itawiki.test')->get());
        $this->assertCount(1, User::where('email', 'student@itawiki.test')->get());
        $this->assertCount(1, User::where('email', 'student2@itawiki.test')->get());
    }

    public function test_user_seeder_assigns_correct_roles(): void
    {
        (new UserSeeder())->run();

        $this->assertTrue(User::where('email', 'superadmin@itawiki.test')->first()->hasRole('superadmin'));
        $this->assertTrue(User::where('email', 'admin@itawiki.test')->first()->hasRole('admin'));
        $this->assertTrue(User::where('email', 'mentor@itawiki.test')->first()->hasRole('mentor'));
        $this->assertTrue(User::where('email', 'student@itawiki.test')->first()->hasRole('student'));
        $this->assertTrue(User::where('email', 'student2@itawiki.test')->first()->hasRole('student'));
    }
}
