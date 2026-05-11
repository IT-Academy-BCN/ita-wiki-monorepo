<?php

declare(strict_types=1);

namespace Tests\Feature\LigaTest;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaStubTest extends TestCase
{
    use RefreshDatabase;

    public function test_ranking_endpoint_is_accessible(): void
    {
        $response = $this->getJson('/api/ligas/ranking');

        $response->assertStatus(200);
    }

    public function test_store_endpoint_creates_liga_entry(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/ligas', [
            'user_id'   => $user->id,
            'league_id' => 1,
        ]);

        $response->assertStatus(201);
    }

    public function test_add_points_updates_user_points(): void
    {
        $user = User::factory()->create();

        Liga::create([
            'user_id'       => $user->id,
            'league_id'     => 1,
            'points'        => 0,
            'points_weekly' => 0,
        ]);

        $response = $this->putJson("/api/ligas/{$user->id}/points", [
            'league_id' => 1,
        ]);

        $response->assertStatus(200);
    }
}