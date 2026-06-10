<?php

declare(strict_types=1);

namespace Tests\Feature\Liga;

use App\Models\Liga;
use App\Models\LigaPointHistory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaAddPointsTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    public function setUp(): void
    {
        parent::setUp();

        $this->user = $this->authenticateUserWithRole('mentor');
        
    }

    public function test_put_increments_points_by_5(): void
    {
        Liga::create([
            'user_id' => $this->user->id,
            'points' => 0,
            'points_weekly' => 0,
        ]);

        $response = $this->putJson("/api/ligas/{$this->user->id}/points");

        $response->assertStatus(200);

        $response->assertJson([
            'user_id' => $this->user->id,
            'points'  => 5,
            'points_weekly' => 5,
        ]);
    }

    public function test_put_three_times_gives_15_points(): void
    {
        Liga::create([
            'user_id' => $this->user->id,
            'points' => 0,
            'points_weekly' => 0,
        ]);

        $this->putJson("/api/ligas/{$this->user->id}/points");
        $this->putJson("/api/ligas/{$this->user->id}/points");

        $response = $this->putJson("/api/ligas/{$this->user->id}/points");

        $response->assertStatus(200);

        $response->assertJson([
            'user_id' => $this->user->id,
            'points'  => 15,
            'points_weekly' => 15,
        ]);
    }

    public function test_put_returns_404_for_unknown_user(): void
    {
        $response = $this->putJson('/api/ligas/99999/points');

        $response->assertStatus(404);
    }

    public function test_put_returns_403_for_user_not_opted_in(): void
    {
        $userWithoutLiga = User::factory()->create();

        $response = $this->putJson("/api/ligas/{$userWithoutLiga->id}/points");

        $response->assertStatus(403);

        $response->assertJson([
            'message' => 'User has not opted in to the liga'
        ]);
    }

    public function test_put_returns_422_for_zero_or_negative_points(): void
    {
        Liga::create([
            'user_id'       => $this->user->id,
            'points'        => 0,
            'points_weekly' => 0,
        ]);

        $this->putJson("/api/ligas/{$this->user->id}/points", ['points' => 0])
            ->assertStatus(422);

        $this->putJson("/api/ligas/{$this->user->id}/points", ['points' => -5])
            ->assertStatus(422);
    }

    public function test_add_points_creates_history_entry(): void
    {
        Liga::create([
            'user_id'       => $this->user->id,
            'points'        => 0,
            'points_weekly' => 0,
        ]);

        $this->putJson("/api/ligas/{$this->user->id}/points", [
            'points'   => 10,
            'activity' => 'PR Review',
        ]);

        $this->assertDatabaseHas('liga_point_histories', [
            'user_id'  => $this->user->id,
            'points'   => 10,
            'activity' => 'PR Review',
        ]);
    }

    public function test_add_points_uses_default_activity_when_not_provided(): void
    {
        Liga::create([
            'user_id'       => $this->user->id,
            'points'        => 0,
            'points_weekly' => 0,
        ]);

        $this->putJson("/api/ligas/{$this->user->id}/points", ['points' => 5]);

        $this->assertDatabaseHas('liga_point_histories', [
            'user_id'  => $this->user->id,
            'points'   => 5,
            'activity' => 'Points awarded',
        ]);
    }

    public function test_put_increments_by_custom_points_amount(): void
    {
        Liga::create([
            'user_id'       => $this->user->id,
            'points'        => 0,
            'points_weekly' => 0,
        ]);

        $response = $this->putJson("/api/ligas/{$this->user->id}/points", ['points' => 10]);

        $response->assertStatus(200);

        $response->assertJson([
            'user_id'       => $this->user->id,
            'points'        => 10,
            'points_weekly' => 10,
        ]);
    }

}
