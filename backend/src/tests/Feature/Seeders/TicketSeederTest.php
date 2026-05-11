<?php

declare(strict_types=1);

namespace Tests\Feature\Seeders;

use App\Models\Ticket;
use App\Models\User;
use Database\Seeders\TicketSeeder;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TicketSeederTest extends TestCase
{
    use RefreshDatabase;

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

    public function test_seeder_covers_both_ticket_types(): void
    {
        $this->assertDatabaseHas('tickets', ['type' => 'error']);
        $this->assertDatabaseHas('tickets', ['type' => 'suggestion']);
    }

    public function test_seeder_creates_all_four_users_with_correct_roles(): void
    {
        $expected = [
            'student@itawiki.test'    => 'student',
            'mentor@itawiki.test'     => 'mentor',
            'admin@itawiki.test'      => 'admin',
            'superadmin@itawiki.test' => 'superadmin',
        ];

        foreach ($expected as $email => $role) {
            $user = User::where('email', $email)->first();
            $this->assertNotNull($user, "{$email} should exist");
            $this->assertTrue($user->hasRole($role), "{$email} should have role '{$role}'");
        }
    }

    public function test_closed_tickets_have_closed_by_and_closed_at_populated(): void
    {
        $closed = Ticket::where('status', 'closed')->get();
        $this->assertNotEmpty($closed);

        foreach ($closed as $ticket) {
            $this->assertNotNull($ticket->closed_by, "Ticket {$ticket->id} missing closed_by");
            $this->assertNotNull($ticket->closed_at, "Ticket {$ticket->id} missing closed_at");
            $this->assertDatabaseHas('users', ['id' => $ticket->closed_by]);
        }
    }

    public function test_non_closed_tickets_do_not_have_closed_at_or_closed_by(): void
    {
        $open = Ticket::whereIn('status', ['pending', 'in_progress', 'blocked', 'ready'])->get();

        foreach ($open as $ticket) {
            $this->assertNull($ticket->closed_at, "Ticket {$ticket->id} (status: {$ticket->status->value}) should not have closed_at");
            $this->assertNull($ticket->closed_by, "Ticket {$ticket->id} (status: {$ticket->status->value}) should not have closed_by");
        }
    }

    public function test_seeder_is_idempotent(): void
    {
        $count = Ticket::count();
        $this->seed(TicketSeeder::class);
        $this->assertEquals($count, Ticket::count());
    }

    public function test_seeder_does_not_duplicate_users_when_run_twice(): void
    {
        $emails = ['student@itawiki.test', 'mentor@itawiki.test', 'admin@itawiki.test', 'superadmin@itawiki.test'];
        $before = User::whereIn('email', $emails)->count();
        $this->seed(TicketSeeder::class);
        $this->assertEquals($before, User::whereIn('email', $emails)->count());
    }
}
