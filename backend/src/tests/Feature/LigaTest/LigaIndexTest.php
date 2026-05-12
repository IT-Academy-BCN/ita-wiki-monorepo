<?php

declare(strict_types=1);
namespace Tests\Feature\Liga;
use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaIndexTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_users_grouped_by_league_id(): void {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        Liga::create(['user_id' => $user1->id, 'points' => 10, 'points_weekly' => 5, 'league_id' => 1]);
        Liga::create(['user_id' => $user2->id, 'points' => 5, 'points_weekly' => 3, 'league_id' => 2]);

        $response = $this->getJson('/api/ligas');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => [
                '*' => ['position', 'user_id', 'username', 'points_weekly', 'league_id']]
        ]);
    }

    public function test_index_returns_users_ordered_by_points_weekly_desc(): void {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        Liga::create(['user_id' => $user1->id, 'points' => 5, 'points_weekly' => 3, 'league_id' => 1]);
        Liga::create(['user_id' => $user2->id, 'points' => 10, 'points_weekly' => 8, 'league_id' => 1]);

        $response = $this->getJson('/api/ligas');
        $response->assertStatus(200);
        $data = $response->json();
        $this->assertEquals(1, $data['1'][0]['position']);
        $this->assertEquals(8, $data['1'][0]['points_weekly']);
    }

    public function test_index_returns_username_from_user_relationship(): void {
        $user = User::factory()->create(['github_user_name' => 'vicenlu']);
        Liga::create(['user_id' => $user->id, 'points' => 10, 'points_weekly' => 5, 'league_id' => 1]);
        $response = $this->getJson('/api/ligas');
        $response->assertStatus(200);
        $this->assertEquals('vicenlu', $response->json()['1'][0]['username']);
    }
}