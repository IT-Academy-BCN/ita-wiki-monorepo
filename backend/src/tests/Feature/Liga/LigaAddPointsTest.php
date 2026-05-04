<?php

declare(strict_types=1);

namespace Tests\Feature\Liga;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaAddPointsTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Liga $ligaEntry;

    public function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $this->ligaEntry = Liga::create([
            'user_id' => $this->user->id,
            'points'  => 0,
        ]);
    }

     
    public function test_put_increments_points_by_5(): void
    {
        
        $response = $this->putJson('/api/ligas/' . $this->user->id . '/points');

        $response->assertStatus(200);
        $response->assertJson([
            'user_id' => $this->user->id,
            'points'  => 5,
        ]);
    }

     public function test_put_three_times_gives_15_points(): void
    {
        
        $this->putJson('/api/ligas/' . $this->user->id . '/points');
        $this->putJson('/api/ligas/' . $this->user->id . '/points');
        $response = $this->putJson('/api/ligas/' . $this->user->id . '/points');

        $response->assertStatus(200);
        $response->assertJson([
            'user_id' => $this->user->id,
            'points'  => 15,
        ]);
    }


     public function test_put_returns_404_for_unknown_user(): void
    {
        
        $response = $this->putJson('/api/ligas/99999/points');

        $response->assertStatus(404);
    }

    public function test_put_creates_liga_and_increments_by_5_when_user_has_no_liga(): void
    {
    $userWithoutLiga = User::factory()->create();

    $response = $this->putJson('/api/ligas/' . $userWithoutLiga->id . '/points');

    $response->assertStatus(200);
    $response->assertJson([
        'user_id' => $userWithoutLiga->id,
        'points'  => 5,
    ]);
    }
}
