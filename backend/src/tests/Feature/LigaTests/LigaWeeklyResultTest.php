<?php

declare(strict_types=1);

namespace Tests\Feature\Liga;

use App\Models\LeagueWeeklyResult;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;
use App\Enums\LeagueTypeEnum;

class LigaWeeklyResultTest extends TestCase
{
    use RefreshDatabase;

    public function test_league_weekly_results_table_exists(): void
    {
        $this->assertTrue(Schema::hasTable('league_weekly_results'));
    }

    public function test_league_weekly_results_table_has_expected_columns(): void
    {
        $this->assertTrue(Schema::hasColumns('league_weekly_results', [
            'id',
            'user_id',
            'year',
            'week_number',
            'from_league',
            'to_league',
            'created_at',
            'updated_at',
        ]));
    }

    public function test_unique_constraint_prevents_duplicate_entries(): void
    {
        $user = User::factory()->create();

        LeagueWeeklyResult::create([
            'user_id' => $user->id,
            'year'        => 2026,
            'week_number' => 25,
            'from_league' => LeagueTypeEnum::Bronze->value,
            'to_league' => LeagueTypeEnum::Silver->value,
        ]);

        $this->expectException(\Illuminate\Database\QueryException::class);

        LeagueWeeklyResult::create([
            'user_id' => $user->id,
            'year'        => 2026,
            'week_number' => 25,
            'from_league' => LeagueTypeEnum::Bronze->value,
            'to_league' => LeagueTypeEnum::Silver->value,
        ]);
    }
}