<?php

declare(strict_types=1);

namespace Tests\Feature\LigaTests;

use App\Console\Commands\ProcessLeaguePromotions;
use App\Enums\LeagueTypeEnum;
use App\Models\Liga;
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class LigaNotificationFieldsTest extends TestCase
{
    public function test_ligas_table_has_notification_tracking_columns(): void
    {
        $this->assertTrue(Schema::hasColumn('ligas', 'previous_league_id'));
        $this->assertTrue(Schema::hasColumn('ligas', 'notification_dismissed'));
    }

    public function test_previous_league_id_defaults_to_null(): void
    {
        $user = User::factory()->create();
        $liga = Liga::create(['user_id' => $user->id, 'points' => 0]);

        $this->assertNull($liga->previous_league_id);
    }

    public function test_notification_dismissed_defaults_to_false(): void
    {
        $user = User::factory()->create();
        $liga = Liga::create(['user_id' => $user->id, 'points' => 0]);

        $this->assertFalse($liga->notification_dismissed);
    }

    public function test_track_league_change_saves_previous_league_and_resets_flag(): void
    {
        $user = User::factory()->create();
        $liga = Liga::create([
            'user_id'                => $user->id,
            'points'                 => 10,
            'league_id'              => LeagueTypeEnum::Bronze,
            'notification_dismissed' => true,
        ]);

        $command = new ProcessLeaguePromotions();
        $command->trackLeagueChange($liga, LeagueTypeEnum::Silver->value);

        $liga->refresh();

        $this->assertEquals(LeagueTypeEnum::Bronze->value, $liga->previous_league_id);
        $this->assertEquals(LeagueTypeEnum::Silver, $liga->league_id);
        $this->assertFalse($liga->notification_dismissed);
    }

    public function test_track_league_change_resets_flag_even_if_already_dismissed(): void
    {
        $user = User::factory()->create();
        $liga = Liga::create([
            'user_id'                => $user->id,
            'points'                 => 20,
            'league_id'              => LeagueTypeEnum::Silver,
            'notification_dismissed' => true,
        ]);

        $command = new ProcessLeaguePromotions();
        $command->trackLeagueChange($liga, LeagueTypeEnum::Gold->value);

        $liga->refresh();

        $this->assertFalse($liga->notification_dismissed);
        $this->assertEquals(LeagueTypeEnum::Silver->value, $liga->previous_league_id);
    }
}
