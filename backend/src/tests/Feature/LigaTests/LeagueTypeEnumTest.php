<?php

declare(strict_types=1);
namespace Tests\Feature\LigaTests;
use App\Enums\LeagueTypeEnum;
use Tests\TestCase;

class LeagueTypeEnumTest extends TestCase
{
    public function test_league_enum_has_correct_values(): void {
        $this->assertEquals(1, LeagueTypeEnum::Bronze->value);
        $this->assertEquals(2, LeagueTypeEnum::Silver->value);
        $this->assertEquals(3, LeagueTypeEnum::Gold->value);
    }

    public function test_league_enum_returns_all_values(): void {
        $this->assertEquals(
            [1, 2, 3],
            LeagueTypeEnum::values()
        );
    }

    public function test_league_enum_contains_all_league_types(): void {
        $this->assertCount(
            3,
            LeagueTypeEnum::cases()
        );
    }
}