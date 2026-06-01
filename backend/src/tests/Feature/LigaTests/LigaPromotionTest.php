<?php
declare(strict_types=1);
namespace Tests\Feature\LigaTests;
use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
class LigaPromotionTest extends TestCase
{
    use RefreshDatabase;
    public function test_top_3_users_get_promoted(): void {
        $users = User::factory()->count(9)->create();
        for ($i = 0; $i < 9; $i++) {
        Liga::create(['user_id' => $users[$i]->id, 'points_weekly' => 100 - ($i * 10), 'league_id' => 1 ]);
        }
        $this->artisan('liga:process-promotions')->assertSuccessful();
        $this->assertEquals(2, Liga::where('user_id', $users[0]->id)->first()->league_id);
        $this->assertEquals(2, Liga::where('user_id', $users[1]->id)->first()->league_id);
        $this->assertEquals(2, Liga::where('user_id', $users[2]->id)->first()->league_id);
    }

    public function test_worst_3_users_get_demoted(): void {
        $users = User::factory()->count(9)->create();
        for ($i = 0; $i < 9; $i++) {
        Liga::create(['user_id' => $users[$i]->id, 'points_weekly' => 100 - ($i * 10),'league_id' => 2]); }
        $this->artisan('liga:process-promotions')->assertSuccessful();
        $this->assertEquals(1, Liga::where('user_id', $users[6]->id)->first()->league_id);
        $this->assertEquals(1, Liga::where('user_id', $users[7]->id)->first()->league_id);
        $this->assertEquals(1, Liga::where('user_id', $users[8]->id)->first()->league_id);
    }

    public function test_user_in_gold_cannot_be_promoted(): void {
        $users = User::factory()->count(3)->create();
        Liga::create(['user_id' => $users[0]->id, 'points_weekly' => 100, 'league_id' => 3]);
        Liga::create(['user_id' => $users[1]->id, 'points_weekly' => 50,  'league_id' => 3]);
        Liga::create(['user_id' => $users[2]->id, 'points_weekly' => 10,  'league_id' => 3]);
        $this->artisan('liga:process-promotions')->assertSuccessful();
        $this->assertEquals(3, Liga::where('user_id', $users[0]->id)->first()->league_id);
    }

    public function test_user_in_bronze_cannot_be_demoted(): void {
        $users = User::factory()->count(3)->create();
        Liga::create(['user_id' => $users[0]->id, 'points_weekly' => 100, 'league_id' => 1]);
        Liga::create(['user_id' => $users[1]->id, 'points_weekly' => 50,  'league_id' => 1]);
        Liga::create(['user_id' => $users[2]->id, 'points_weekly' => 10,  'league_id' => 1]);
        $this->artisan('liga:process-promotions')->assertSuccessful();
        $this->assertEquals(1, Liga::where('user_id', $users[2]->id)->first()->league_id);
    }

    public function test_league_with_less_than_3_users_is_skipped(): void {
        $users = User::factory()->count(2)->create();
        Liga::create(['user_id' => $users[0]->id, 'points_weekly' => 100, 'league_id' => 1]);
        Liga::create(['user_id' => $users[1]->id, 'points_weekly' => 50,  'league_id' => 1]);
        $this->artisan('liga:process-promotions')->assertSuccessful();
        $this->assertEquals(1, Liga::where('user_id', $users[0]->id)->first()->league_id);
        $this->assertEquals(1, Liga::where('user_id', $users[1]->id)->first()->league_id);
    }
}