<?php

declare(strict_types=1);

namespace Tests\Feature\LigaTests;

use App\Models\User;
use App\Models\LeagueWeeklyResult;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_notification_returns_false_if_no_history(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->getJson(route('ligas.notification'));

        $response->assertStatus(200)
                 ->assertJson(['hasChange' => false]);
    }

    public function test_get_notification_returns_false_if_no_league_change(): void
    {
        $user = User::factory()->create();

        LeagueWeeklyResult::factory()->create([
            'user_id' => $user->id,
            'from_league' => 1,
            'to_league' => 1,
            'year' => 2026,
            'week_number' => 25,
        ]);

        $response = $this->actingAs($user)->getJson(route('ligas.notification'));

        $response->assertStatus(200)
                 ->assertJson(['hasChange' => false]);
    }

    public function test_get_notification_returns_true_for_promotion(): void
    {
        $user = User::factory()->create();

        LeagueWeeklyResult::factory()->create([
            'user_id' => $user->id,
            'from_league' => 1,
            'to_league' => 2,
            'year' => 2026,
            'week_number' => 25,
        ]);

        $response = $this->actingAs($user)->getJson(route('ligas.notification'));

        $response->assertStatus(200)
                 ->assertJson([
                     'hasChange' => true,
                     'direction' => 'up',
                     'leagueName' => 'Silver',
                     'year' => 2026,
                     'week_number' => 25,
                 ]);
    }

    public function test_get_notification_returns_true_for_demotion(): void
    {
        $user = User::factory()->create();

        LeagueWeeklyResult::factory()->create([
            'user_id' => $user->id,
            'from_league' => 3,
            'to_league' => 2,
            'year' => 2026,
            'week_number' => 26,
        ]);

        $response = $this->actingAs($user)->getJson(route('ligas.notification'));

        $response->assertStatus(200)
                 ->assertJson([
                     'hasChange' => true,
                     'direction' => 'down',
                     'leagueName' => 'Silver',
                     'year' => 2026,
                     'week_number' => 26,
                 ]);
    }
}
