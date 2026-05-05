<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        Ticket::factory(3)
            ->pending()
            ->create([
                'code_connect_id' => fn () => $users->random()->id,
            ]);

        Ticket::factory(2)
            ->inProgress()
            ->create([
                'code_connect_id' => fn () => $users->random()->id,
                'assignee_id'     => fn () => $users->random()->id,
            ]);

        Ticket::factory(2)
            ->blocked()
            ->create([
                'code_connect_id' => fn () => $users->random()->id,
                'assignee_id'     => fn () => $users->random()->id,
            ]);

        Ticket::factory(2)
            ->ready()
            ->create([
                'code_connect_id' => fn () => $users->random()->id,
                'assignee_id'     => fn () => $users->random()->id,
            ]);

        Ticket::factory(3)
            ->closed()
            ->create([
                'code_connect_id' => fn () => $users->random()->id,
                'assignee_id'     => fn () => $users->random()->id,
                'closed_by'       => fn () => $users->random()->id,
            ]);
    }
}
