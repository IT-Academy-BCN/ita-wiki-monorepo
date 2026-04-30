<?php

declare(strict_types=1);

namespace Tests\Feature\LigaTests;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

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

        $response = $this->postJson('/api/ligas', ['user_id' => $user->id]);

        $response->assertStatus(201);
    }

    public function test_add_points_updates_user_points(): void
    {
        $user = User::factory()->create();

        $response = $this->putJson("/api/ligas/{$user->id}/points");

        $response->assertStatus(200);

        $response->assertJson([
            'user_id' => $user->id,
            'points'  => 99,
        ]);
    }
}
