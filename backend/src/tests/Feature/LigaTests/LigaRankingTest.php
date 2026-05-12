<?php

declare(strict_types=1);

namespace Tests\Feature\Liga;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaRankingTest extends TestCase {

    use RefreshDatabase;

    public function test_ranking_returns_users_ordered_by_points_desc(): void {

        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        Liga::create(['user_id' => $user1->id, 'points' => 10]);
        Liga::create(['user_id' => $user2->id, 'points' => 20]);
        $response = $this->getJson('/api/ligas/ranking');
        $response->assertStatus(200);
        $this->assertEquals(20, $response->json()[0]['points']);
        $this->assertEquals(10, $response->json()[1]['points']);
    }
    public function test_ranking_assigns_correct_positions(): void {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        Liga::create(['user_id' => $user1->id, 'points' => 30]);
        Liga::create(['user_id' => $user2->id, 'points' => 20]);
        $response = $this->getJson('/api/ligas/ranking');
        $response->assertStatus(200);
        $this->assertEquals(1, $response->json()[0]['position']);
        $this->assertEquals(2, $response->json()[1]['position']);
    }

    public function test_ranking_returns_username(): void {
        $user = User::factory()->create(['github_user_name' => 'pepe']);
        Liga::create(['user_id' => $user->id, 'points' => 10]);
        $response = $this->getJson('/api/ligas/ranking');
        $response->assertStatus(200);
        $this->assertEquals('pepe', $response->json()[0]['username']);
    }

}