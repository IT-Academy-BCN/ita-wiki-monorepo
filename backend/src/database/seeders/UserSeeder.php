<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Superadmin
        $superadmin = User::firstOrCreate(
            ['email' => 'superadmin@test.com'],
            [
                'github_id'        => '11111111',
                'github_user_name' => 'superadmin_test',
                'name'             => 'Superadmin Test',
                'password'         => Hash::make('password'),
            ]
        );
        $superadmin->syncRoles(['superadmin']);

        // Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'github_id'        => '22222222',
                'github_user_name' => 'admin_test',
                'name'             => 'Admin Test',
                'password'         => Hash::make('password'),
            ]
        );
        $admin->syncRoles(['admin']);

        // Mentor
        $mentor = User::firstOrCreate(
            ['email' => 'mentor@test.com'],
            [
                'github_id'        => '33333333',
                'github_user_name' => 'mentor_test',
                'name'             => 'Mentor Test',
                'password'         => Hash::make('password'),
            ]
        );
        $mentor->syncRoles(['mentor']);

        // Student 1
        $student1 = User::firstOrCreate(
            ['email' => 'student1@test.com'],
            [
                'github_id'        => '44444444',
                'github_user_name' => 'student_test_1',
                'name'             => 'Student Test 1',
                'password'         => Hash::make('password'),
            ]
        );
        $student1->syncRoles(['student']);

        // Student 2
        $student2 = User::firstOrCreate(
            ['email' => 'student2@test.com'],
            [
                'github_id'        => '55555555',
                'github_user_name' => 'student_test_2',
                'name'             => 'Student Test 2',
                'password'         => Hash::make('password'),
            ]
        );
        $student2->syncRoles(['student']);

        $this->command->info('Users created with roles:');
        $this->command->info('superadmin@test.com / password → superadmin');
        $this->command->info('admin@test.com / password → admin');
        $this->command->info('mentor@test.com / password → mentor');
        $this->command->info('student1@test.com / password → student');
        $this->command->info('student2@test.com / password → student');
    }
}
