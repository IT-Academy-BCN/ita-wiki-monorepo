<?php

declare(strict_types=1);

namespace Tests\Feature\Liga;

use App\Models\Liga;
use App\Models\User;
use App\Enums\LeagueTypeEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaPromotionLogicTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app->make(\Illuminate\Contracts\Console\Kernel::class)->registerCommand(
            new \App\Console\Commands\ProcessLeaguePromotions()
        );
    }

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

    public function test_top_3_in_silver_are_promoted_to_gold(): void
    {
        $users = User::factory(4)->create();
        Liga::create(['user_id' => $users[0]->id, 'points_weekly' => 30, 'league_id' => LeagueTypeEnum::Silver]);
        Liga::create(['user_id' => $users[1]->id, 'points_weekly' => 20, 'league_id' => LeagueTypeEnum::Silver]);
        Liga::create(['user_id' => $users[2]->id, 'points_weekly' => 10, 'league_id' => LeagueTypeEnum::Silver]);
        Liga::create(['user_id' => $users[3]->id, 'points_weekly' => 5,  'league_id' => LeagueTypeEnum::Silver]);

        $this->artisan('liga:process-promotions')->assertExitCode(0);

        $this->assertEquals(LeagueTypeEnum::Gold,   Liga::where('user_id', $users[0]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Gold,   Liga::where('user_id', $users[1]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Gold,   Liga::where('user_id', $users[2]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Silver, Liga::where('user_id', $users[3]->id)->first()->league_id);
    }

    public function test_bottom_3_in_gold_are_demoted_to_silver(): void
    {
        $users = User::factory(4)->create();
        Liga::create(['user_id' => $users[0]->id, 'points_weekly' => 30, 'league_id' => LeagueTypeEnum::Gold]);
        Liga::create(['user_id' => $users[1]->id, 'points_weekly' => 20, 'league_id' => LeagueTypeEnum::Gold]);
        Liga::create(['user_id' => $users[2]->id, 'points_weekly' => 10, 'league_id' => LeagueTypeEnum::Gold]);
        Liga::create(['user_id' => $users[3]->id, 'points_weekly' => 5,  'league_id' => LeagueTypeEnum::Gold]);

        $this->artisan('liga:process-promotions')->assertExitCode(0);

        $this->assertEquals(LeagueTypeEnum::Gold,   Liga::where('user_id', $users[0]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Silver,  Liga::where('user_id', $users[1]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Silver,  Liga::where('user_id', $users[2]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Silver,  Liga::where('user_id', $users[3]->id)->first()->league_id);
    }

    public function test_bottom_3_in_silver_are_demoted_to_bronze(): void
    {
        $users = User::factory(7)->create();
        Liga::create(['user_id' => $users[0]->id, 'points_weekly' => 60, 'league_id' => LeagueTypeEnum::Silver]);
        Liga::create(['user_id' => $users[1]->id, 'points_weekly' => 50, 'league_id' => LeagueTypeEnum::Silver]);
        Liga::create(['user_id' => $users[2]->id, 'points_weekly' => 40, 'league_id' => LeagueTypeEnum::Silver]);
        Liga::create(['user_id' => $users[3]->id, 'points_weekly' => 30, 'league_id' => LeagueTypeEnum::Silver]);
        Liga::create(['user_id' => $users[4]->id, 'points_weekly' => 20, 'league_id' => LeagueTypeEnum::Silver]);
        Liga::create(['user_id' => $users[5]->id, 'points_weekly' => 10, 'league_id' => LeagueTypeEnum::Silver]);
        Liga::create(['user_id' => $users[6]->id, 'points_weekly' => 5,  'league_id' => LeagueTypeEnum::Silver]);

        $this->artisan('liga:process-promotions')->assertExitCode(0);

        $this->assertEquals(LeagueTypeEnum::Gold,   Liga::where('user_id', $users[0]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Gold,   Liga::where('user_id', $users[1]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Gold,   Liga::where('user_id', $users[2]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Bronze, Liga::where('user_id', $users[4]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Bronze, Liga::where('user_id', $users[5]->id)->first()->league_id);
        $this->assertEquals(LeagueTypeEnum::Bronze, Liga::where('user_id', $users[6]->id)->first()->league_id);
    }
}