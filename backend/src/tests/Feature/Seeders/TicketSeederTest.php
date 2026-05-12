<?php

declare(strict_types=1);

namespace Tests\Feature\Seeders;

use Database\Seeders\TicketSeeder;
use Tests\TestCase;

class TicketSeederTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(TicketSeeder::class);
    }

    public function test_seeder_covers_all_ticket_statuses(): void
    {
        foreach (['pending', 'in_progress', 'blocked', 'ready', 'closed'] as $status) {
            $this->assertDatabaseHas('tickets', ['status' => $status]);
        }
    }

    public function test_seeder_covers_all_ticket_priorities(): void
    {
        foreach (['low', 'medium', 'high', 'critical'] as $priority) {
            $this->assertDatabaseHas('tickets', ['priority' => $priority]);
        }
    }
}
