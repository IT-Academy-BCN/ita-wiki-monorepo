<?php

declare(strict_types=1);
namespace Tests\Feature\Liga;
use App\Enums\LeagueTypeEnum;
use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaPromotionTest extends TestCase
{
    use RefreshDatabase;

    public function test_top_user_gets_promoted(): void {
        $users = User::factory()->count(3)->create();
        Liga::create(['user_id' => $users[0]->id,'points_weekly' => 100,'league_id' => LeagueTypeEnum::Bronze->value]);
        Liga::create(['user_id' => $users[1]->id,'points_weekly' => 50,'league_id' => LeagueTypeEnum::Bronze->value]);
        Liga::create(['user_id' => $users[2]->id,'points_weekly' => 10,'league_id' => LeagueTypeEnum::Bronze->value]);
        $this->artisan('liga:process-promotions')->assertSuccessful();
        $this->assertEquals( LeagueTypeEnum::Silver, Liga::where('user_id', $users[0]->id)->first()->league_id);
    }

    public function test_bottom_user_gets_demoted(): void {
        $users = User::factory()->count(3)->create();
        Liga::create(['user_id' => $users[0]->id,'points_weekly' => 100,'league_id' => LeagueTypeEnum::Silver->value]);
        Liga::create(['user_id' => $users[1]->id,'points_weekly' => 50,'league_id' => LeagueTypeEnum::Silver->value]);
        Liga::create(['user_id' => $users[2]->id,'points_weekly' => 10,'league_id' => LeagueTypeEnum::Silver->value]);
        $this->artisan('liga:process-promotions')->assertSuccessful();
        $this->assertEquals(LeagueTypeEnum::Bronze, Liga::where('user_id', $users[2]->id)->first()->league_id);
    }

    public function test_user_in_gold_cannot_be_promoted(): void {
        $users = User::factory()->count(3)->create();
        Liga::create(['user_id' => $users[0]->id,'points_weekly' => 100,'league_id' => LeagueTypeEnum::Gold->value]);
        Liga::create(['user_id' => $users[1]->id,'points_weekly' => 50,'league_id' => LeagueTypeEnum::Gold->value]);
        Liga::create(['user_id' => $users[2]->id,'points_weekly' => 10,'league_id' => LeagueTypeEnum::Gold->value]);
        $this->artisan('liga:process-promotions')->assertSuccessful();
        $this->assertEquals(LeagueTypeEnum::Gold, Liga::where('user_id', $users[0]->id)->first()->league_id);
    }

    public function test_league_with_less_than_3_users_is_skipped(): void {
        $users = User::factory()->count(2)->create();
        Liga::create(['user_id' => $users[0]->id,'points_weekly' => 100,'league_id' => LeagueTypeEnum::Bronze->value]);
        Liga::create(['user_id' => $users[1]->id,'points_weekly' => 50,'league_id' => LeagueTypeEnum::Bronze->value]);
        $this->artisan('liga:process-promotions')->assertSuccessful();
        $this->assertEquals( LeagueTypeEnum::Bronze, Liga::where('user_id', $users[0]->id)->first()->league_id);
        $this->assertEquals( LeagueTypeEnum::Bronze, Liga::where('user_id', $users[1]->id)->first()->league_id);
    }
}