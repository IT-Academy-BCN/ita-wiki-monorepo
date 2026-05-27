<?php

declare(strict_types=1);

namespace Tests\Feature\Liga;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaResetWeeklyCommandTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_liga_reset_weekly_command_resets_points_weekly_only(): void
    {
        $user = User::factory()->create();
        Liga::create([
            'user_id' => $user->id,
            'points' => 100,
            'points_weekly' => 50,
        ]);
    
        $this->artisan('liga:reset-weekly')->assertExitCode(0);
    
        $this->assertEquals(0, Liga::first()->points_weekly);
        $this->assertEquals(100, Liga::first()->points);
    }
}
