<?php

declare(strict_types=1);

namespace Tests\Feature\LigaTests;

use Tests\TestCase;
use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LigaStoreLigaTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_creates_liga_entry_with_zero_points(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/ligas', ['user_id' => $user->id]);

        $response->assertStatus(201);

          $this->assertDatabaseHas('ligas', [
             'user_id' => $user->id,
             'points'  => 0,
             'league_id' => 1,
             'points_weekly' => 0,
          ]);
  
        $response->assertJson(['user_id' => $user->id,'points' => 0,]);
    }

    public function test_store_returns_409_if_entry_already_exists(): void
    {
        $user = User::factory()->create();

        Liga::create(['user_id' => $user->id,'points' => 0, 'league_id' => 1, 'points_weekly' => 0]);

        $response = $this->postJson('/api/ligas', ['user_id' => $user->id,]);

        $response->assertStatus(409);

        $response->assertJson([
            'error' => 'Entry already exists for this user',
        ]);
    }

    public function test_store_returns_422_when_user_id_is_missing(): void
    {
        $response = $this->postJson('/api/ligas', []);

        $response->assertStatus(422);
    }

    public function test_store_returns_422_when_user_does_not_exist(): void
    {
        $response = $this->postJson('/api/ligas', [  'user_id' => 99999,]);

        $response->assertStatus(422);
    }
}