<?php

declare(strict_types=1);

namespace Tests\Feature\Liga;

use App\Enums\LeagueTypeEnum;
use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProcessLeaguePromotionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_top_3_in_bronze_are_promoted_to_silver(): void
    {
        $users = User::factory(4)->create();
        Liga::create(['user_id' => $users[0]->id, 'points_weekly' => 30, 'league_id' => LeagueTypeEnum::Bronze]);
        Liga::create(['user_id' => $users[1]->id, 'points_weekly' => 20, 'league_id' => LeagueTypeEnum::Bronze]);
        Liga::create(['user_id' => $users[2]->id, 'points_weekly' => 10, 'league_id' => LeagueTypeEnum::Bronze]);
        Liga::create(['user_id' => $users[3]->id, 'points_weekly' => 5,  'league_id' => LeagueTypeEnum::Bronze]);

        $this->artisan('liga:process-promotions')->assertExitCode(0);

        $this->assertEquals(LeagueTypeEnum::Silver, Liga::where('user_id', $users[0]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Silver, Liga::where('user_id', $users[1]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Silver, Liga::where('user_id', $users[2]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Bronze, Liga::where('user_id', $users[3]->id)->first()->league_id);
    }

    public function test_bottom_3_in_gold_are_demoted_to_silver(): void
    {
        $users = User::factory(4)->create();
        Liga::create(['user_id' => $users[0]->id, 'points_weekly' => 30, 'league_id' => LeagueTypeEnum::Gold]);
        Liga::create(['user_id' => $users[1]->id, 'points_weekly' => 20, 'league_id' => LeagueTypeEnum::Gold]);
        Liga::create(['user_id' => $users[2]->id, 'points_weekly' => 10, 'league_id' => LeagueTypeEnum::Gold]);
        Liga::create(['user_id' => $users[3]->id, 'points_weekly' => 5,  'league_id' => LeagueTypeEnum::Gold]);

        $this->artisan('liga:process-promotions')->assertExitCode(0);

        $this->assertEquals(LeagueTypeEnum::Gold, Liga::where('user_id', $users[0]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Silver, Liga::where('user_id', $users[1]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Silver, Liga::where('user_id', $users[2]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Silver, Liga::where('user_id', $users[3]->id)->first()->league_id);
    }

    public function test_global_points_are_not_affected(): void
    {
        $user = User::factory()->create();
        Liga::create(['user_id' => $user->id, 'points' => 100, 'points_weekly' => 50, 'league_id' => LeagueTypeEnum::Bronze]);

        $this->artisan('liga:process-promotions')->assertExitCode(0);

        $this->assertEquals(100, Liga::where('user_id', $user->id)->first()->points);
    }
}
