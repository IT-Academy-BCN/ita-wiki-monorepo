<?php

declare(strict_types=1);

namespace Tests\Feature\Liga;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaTriggerWeeklyTransitionTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app->make(\Illuminate\Contracts\Console\Kernel::class)->registerCommand(
            new \App\Console\Commands\ProcessLeaguePromotions()
        );
    }

    public function test_mentor_can_trigger_weekly_transition(): void
    {
        $user = $this->authenticateUserWithRole('mentor');
        Liga::create([
            'user_id' => $user->id,
            'points' => 10,
            'points_weekly' => 10,
        ]);
        $response = $this->postJson('/api/ligas/trigger-weekly-transition');
        $response->assertStatus(200);
        $this->assertDatabaseHas('ligas', ['user_id' => $user->id, 'points' => 10, 'points_weekly' => 0,]);
    }

    public function test_student_cannot_trigger_weekly_transition(): void
    {
        $user = $this->authenticateUserWithRole('student');
        $response = $this->postJson('/api/ligas/trigger-weekly-transition');
        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_trigger_weekly_transition(): void
    {
        $response = $this->postJson('/api/ligas/trigger-weekly-transition');
        $response->assertStatus(401);
    }
}
