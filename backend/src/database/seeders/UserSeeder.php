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

        $this->command->info('Users created with roles:');
        $this->command->info('superadmin@test.com / password → superadmin');
        $this->command->info('admin@test.com / password → admin');
    }
}
