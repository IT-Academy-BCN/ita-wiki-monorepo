<?php

declare(strict_types=1);

namespace Tests\Feature\LigaTests;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaGetRankingTest extends TestCase
{
    use RefreshDatabase;

    public function test_endpoint_is_public_and_requires_no_auth_token(): void
    {
        $response = $this->getJson('/api/ligas/ranking');

        $response->assertStatus(200);
    }

    public function test_returns_empty_array_when_no_entries_exist(): void
    {
        $response = $this->getJson('/api/ligas/ranking');

        $response->assertStatus(200)
            ->assertExactJson([]);
    }

    public function test_response_shape_matches_expected_contract(): void
    {
        $user = User::factory()->create();

        Liga::factory()->create([
            'user_id'       => $user->id,
            'league_id'     => 1,
            'points'        => 50,
            'points_weekly' => 0,
        ]);

        $response = $this->getJson('/api/ligas/ranking');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'position',
                    'user_id',
                    'user_name',
                    'points',
                    'points_weekly',
                    'created_at',
                    'updated_at',
                ],
            ]);
    }

    public function test_returns_entries_sorted_by_points_descending(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $userC = User::factory()->create();

        Liga::factory()->create([
            'user_id'       => $userA->id,
            'league_id'     => 1,
            'points'        => 10,
            'points_weekly' => 0,
        ]);

        Liga::factory()->create([
            'user_id'       => $userB->id,
            'league_id'     => 1,
            'points'        => 30,
            'points_weekly' => 0,
        ]);

        Liga::factory()->create([
            'user_id'       => $userC->id,
            'league_id'     => 1,
            'points'        => 20,
            'points_weekly' => 0,
        ]);

        $response = $this->getJson('/api/ligas/ranking');

        $response->assertStatus(200);

        $data = $response->json();

        $this->assertEquals(30, $data[0]['points']);
        $this->assertEquals(20, $data[1]['points']);
        $this->assertEquals(10, $data[2]['points']);
    }

    public function test_positions_are_sequential_starting_at_one(): void
    {
        $users = User::factory(3)->create();

        foreach ($users as $i => $user) {
            Liga::factory()->create([
                'user_id'       => $user->id,
                'league_id'     => 1,
                'points'        => ($i + 1) * 10,
                'points_weekly' => 0,
            ]);
        }

        $response = $this->getJson('/api/ligas/ranking');

        $response->assertStatus(200);

        $data = $response->json();

        foreach ($data as $index => $entry) {
            $this->assertEquals($index + 1, $entry['position']);
        }
    }

    public function test_users_with_zero_points_appear_in_ranking(): void
    {
        $user = User::factory()->create();

        Liga::factory()->create([
            'user_id'       => $user->id,
            'league_id'     => 1,
            'points'        => 0,
            'points_weekly' => 0,
        ]);

        $response = $this->getJson('/api/ligas/ranking');

        $response->assertStatus(200);

        $this->assertCount(1, $response->json());
        $this->assertEquals(0, $response->json()[0]['points']);
    }

    public function test_users_with_equal_points_get_sequential_positions(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        Liga::factory()->create([
            'user_id'       => $userA->id,
            'league_id'     => 1,
            'points'        => 50,
            'points_weekly' => 0,
        ]);

        Liga::factory()->create([
            'user_id'       => $userB->id,
            'league_id'     => 1,
            'points'        => 50,
            'points_weekly' => 0,
        ]);

        $response = $this->getJson('/api/ligas/ranking');

        $response->assertStatus(200);

        $data = $response->json();

        $this->assertEquals(1, $data[0]['position']);
        $this->assertEquals(2, $data[1]['position']);

        $this->assertEquals(50, $data[0]['points']);
        $this->assertEquals(50, $data[1]['points']);
    }
}