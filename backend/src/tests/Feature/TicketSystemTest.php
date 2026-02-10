<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Team;
use App\Models\Ticket;
use App\Models\TicketComment;
use App\Enums\TicketStatusEnum;
use App\Enums\TicketTypeEnum;
use App\Enums\AffectedAppEnum;
use App\Enums\AffectedFunctionEnum;

class TicketSystemTest extends TestCase
{
   /** @test */
   public function team_model_can_be_created(): void
   {
       $team = Team::create([
            'name' => 'Frontend Team',
            'description' => 'Equipo de React y Vue'
        ]);

        $this->assertDatabaseHas('teams', [
            'name' => 'Frontend Team'
        ]);

        $this->assertInstanceOf(Team::class, $team);
    }

    /** @test */
    public function team_has_many_to_many_relation_with_users(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create();

        $team->users()->attach($user->id);

        $this->assertTrue($team->users->contains($user));
        $this->assertTrue($user->teams->contains($team));
    }

    /** @test */
    public function ticket_model_can_be_created_with_enums(): void
    {
        $user = User::factory()->create();

        $ticket = Ticket::create([
            'name' => 'Error en login',
            'incident_date' => now(),
            'affected_app' => AffectedAppEnum::WikiFrontend,
            'type' => TicketTypeEnum::Error,
            'affected_function' => AffectedFunctionEnum::Login,
            'description' => 'No puedo iniciar sesión',
            'created_by' => $user->id,
            'status' => TicketStatusEnum::Pending
        ]);

        $this->assertInstanceOf(Ticket::class, $ticket);
        $this->assertEquals(TicketStatusEnum::Pending, $ticket->status);
        $this->assertEquals(TicketTypeEnum::Error, $ticket->type);
    }

    /** @test */
    public function ticket_belongs_to_creator(): void
    {
        $user = User::factory()->create();
        $ticket = Ticket::factory()->create(['created_by' => $user->id]);

        $this->assertInstanceOf(User::class, $ticket->creator);
        $this->assertEquals($user->id, $ticket->creator->id);
    }

    /** @test */
    public function ticket_belongs_to_assigned_team(): void
    {
        $team = Team::factory()->create();
        $user = User::factory()->create();
        $ticket = Ticket::factory()->create([
            'created_by' => $user->id,
            'assigned_team_id' => $team->id
        ]);

        $this->assertInstanceOf(Team::class, $ticket->assignedTeam);
        $this->assertEquals($team->id, $ticket->assignedTeam->id);
    }

    /** @test */ 
    public function ticket_has_many_comments(): void
    {
        $user = User::factory()->create();
        $ticket = Ticket::factory()->create(['created_by' => $user->id]);

        $comment = $ticket->comments()->create([
            'user_id' => $user->id,
            'comment' => 'Este es un comentario de prueba',
            'is_closing_comment' => false
        ]);

        $this->assertCount(1, $ticket->comments);
        $this->assertInstanceOf(TicketComment::class, $comment);
    }

    /** @test */
    public function ticket_comment_belongs_to_ticket_and_user(): void
    {
        $user = User::factory()->create();
        $ticket = Ticket::factory()->create(['created_by' => $user->id]);        
        $comment = TicketComment::factory()->create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id
        ]);

        $this->assertInstanceOf(Ticket::class, $comment->ticket);
        $this->assertInstanceOf(User::class, $comment->user);
        $this->assertEquals($ticket->id, $comment->ticket->id);
        $this->assertEquals($user->id, $comment->user->id);
    }

    /** @test */
    public function user_has_teams_relation(): void
    {
        $user = User::factory()->create();
        $team = Team::factory()->create();

        $user->teams()->attach($team->id);

        $this->assertCount(1, $user->teams);
        $this->assertInstanceOf(Team::class, $user->teams->first());
    }

    /** @test */
    public function user_has_created_tickets_relation(): void
    {
        $user = User::factory()->create();
        $ticket = Ticket::factory()->create(['created_by' => $user->id]);

        $this->assertCount(1, $user->createdTickets);
        $this->assertInstanceOf(Ticket::class, $user->createdTickets->first());
    }

    /** @test */
    public function ticket_casts_work_correctly(): void
    {
        $user = User::factory()->create();
        $ticket = Ticket::factory()->create([
            'created_by' => $user->id,
            'incident_date' => '2026-02-08'
        ]);

        $this->assertInstanceOf(\Carbon\Carbon::class, $ticket->incident_date);
        $this->assertTrue($ticket->status instanceof TicketStatusEnum);
        $this->assertTrue($ticket->type instanceof TicketTypeEnum);
    }

    /** @test */
    public function ticket_comment_casts_work_correctly(): void
    {
        $user = User::factory()->create();
        $ticket = Ticket::factory()->create(['created_by' => $user->id]);
        $comment = TicketComment::factory()->create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'is_closing_comment' => true
        ]);

        $this->assertIsBool($comment->is_closing_comment);
        $this->assertTrue($comment->is_closing_comment);
    }
}