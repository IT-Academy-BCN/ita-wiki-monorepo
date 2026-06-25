<?php

declare(strict_types=1);

namespace Tests\Feature\Liga;

use App\Models\LeagueWeeklyResult;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Enums\LeagueTypeEnum;

class LigaWeeklyResultTest extends TestCase
{
    use RefreshDatabase;

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