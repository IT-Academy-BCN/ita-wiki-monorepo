<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\TicketPriorityEnum;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;


class TicketSeeder extends Seeder
{
    public function run(): void
    {
        Ticket::query()->delete();

        $student    = $this->findOrCreateUser('student@itawiki.test', 'student');
        $mentor     = $this->findOrCreateUser('mentor@itawiki.test', 'mentor');
        $admin      = $this->findOrCreateUser('admin@itawiki.test', 'admin');
        $superadmin = $this->findOrCreateUser('superadmin@itawiki.test', 'superadmin');

        $priorities = TicketPriorityEnum::values();

        $statuses = [
            ['status' => 'pending',     'assignee_id' => null],
            ['status' => 'in_progress', 'assignee_id' => $mentor->id],
            ['status' => 'blocked',     'assignee_id' => $mentor->id],
            ['status' => 'ready',       'assignee_id' => $admin->id],
            ['status' => 'closed',      'assignee_id' => $mentor->id,     'closed_by' => $admin->id,      'closed_at' => now()->subDays(5)],
            ['status' => 'closed',      'assignee_id' => $superadmin->id, 'closed_by' => $superadmin->id, 'closed_at' => now()->subDays(2)],
        ];

        foreach ($statuses as $i => $attrs) {
            Ticket::factory()->create(array_merge([
                'code_connect_id' => $student->id,
                'priority'        => $priorities[$i % count($priorities)],
            ], $attrs));
        }

        Ticket::factory()->count(4)->create(['code_connect_id' => $student->id]);

        $this->command->info('TicketSeeder: ' . Ticket::count() . ' tickets created.');
    }

    private function findOrCreateUser(string $email, string $role): User
    {
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'github_id'        => fake()->unique()->numerify('########'),
                'github_user_name' => str_replace('@itawiki.test', '', $email),
                'name'             => ucfirst($role) . ' User',
            ]
        );

        if (! $user->hasRole($role)) {
            $user->assignRole($role);
        }

        return $user;
    }
}
