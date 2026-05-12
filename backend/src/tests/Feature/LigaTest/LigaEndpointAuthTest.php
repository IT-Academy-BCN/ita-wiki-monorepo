<?php

declare(strict_types=1);

namespace Tests\Feature\LigaTests;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaEndpointAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_store_liga(): void
    {
        $response = $this->postJson('/api/ligas', ['user_id' => 1]);

        $response->assertStatus(401);
    }

    public function test_unauthenticated_user_cannot_add_points(): void
    {
        $user = User::factory()->create();

        $response = $this->putJson("/api/ligas/{$user->id}/points", ['points' => 10]);

        $response->assertStatus(401);
    }

    public function test_unauthenticated_user_can_access_ranking(): void
    {
        $response = $this->getJson('/api/ligas/ranking');

        $response->assertStatus(200);
    }

    public function test_authenticated_user_can_store_liga(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/ligas', ['user_id' => $user->id]);

        $response->assertStatus(201);
    }

    public function test_authenticated_user_can_add_points(): void
    {
        $user = User::factory()->create();
        Liga::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->putJson("/api/ligas/{$user->id}/points", ['points' => 10]);

        $response->assertStatus(200);
    }
}
