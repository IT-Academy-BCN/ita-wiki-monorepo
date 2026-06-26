<?php

declare(strict_types=1);

namespace Tests\Feature\LigaTests;

use App\Enums\LeagueTypeEnum;
use App\Models\LeagueWeeklyResult;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_returns_false_when_user_has_no_league_history(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->getJson(route('ligas.notification'))
            ->assertStatus(200)
            ->assertJson(['hasChange' => false]);
    }

    public function test_returns_false_when_recent_change_is_same_league(): void
    {
        $user = User::factory()->create();

        LeagueWeeklyResult::create([
            'user_id' => $user->id,
            'year' => 2026,
            'week_number' => 26,
            'from_league' => LeagueTypeEnum::Bronze,
            'to_league' => LeagueTypeEnum::Bronze,
        ]);

        $this->actingAs($user)
            ->getJson(route('ligas.notification'))
            ->assertStatus(200)
            ->assertJson(['hasChange' => false]);
    }

    public function test_returns_false_when_league_change_is_older_than_24h(): void
    {
        $user = User::factory()->create();

        $record = LeagueWeeklyResult::create([
            'user_id' => $user->id,
            'year' => 2026,
            'week_number' => 26,
            'from_league' => LeagueTypeEnum::Bronze,
            'to_league' => LeagueTypeEnum::Silver,
        ]);
        $record->forceFill(['created_at' => now()->subDays(2)])->save();

        $this->actingAs($user)
            ->getJson(route('ligas.notification'))
            ->assertStatus(200)
            ->assertJson(['hasChange' => false]);
    }

    public function test_returns_promotion_when_recent_change_goes_up(): void
    {
        $user = User::factory()->create();

        $record = LeagueWeeklyResult::create([
            'user_id' => $user->id,
            'year' => 2026,
            'week_number' => 26,
            'from_league' => LeagueTypeEnum::Bronze,
            'to_league' => LeagueTypeEnum::Silver,
        ]);
        $record->forceFill(['created_at' => now()->subHours(6)])->save();

        $this->actingAs($user)
            ->getJson(route('ligas.notification'))
            ->assertStatus(200)
            ->assertJson([
                'hasChange' => true,
                'direction' => 'up',
                'leagueName' => 'Silver',
            ]);
    }

    public function test_returns_demotion_when_recent_change_goes_down(): void
    {
        $user = User::factory()->create();

        $record = LeagueWeeklyResult::create([
            'user_id' => $user->id,
            'year' => 2026,
            'week_number' => 26,
            'from_league' => LeagueTypeEnum::Gold,
            'to_league' => LeagueTypeEnum::Silver,
        ]);
        $record->forceFill(['created_at' => now()->subHours(1)])->save();

        $this->actingAs($user)
            ->getJson(route('ligas.notification'))
            ->assertStatus(200)
            ->assertJson([
                'hasChange' => true,
                'direction' => 'down',
                'leagueName' => 'Silver',
            ]);
    }
}
