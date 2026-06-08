<?php

declare(strict_types=1);

namespace Tests\Feature\LigaTests;

use App\Models\LigaPointHistory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaGetHistoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_get_their_history(): void
    {
        $user = $this->authenticateUserWithRole('student');

        LigaPointHistory::create([
            'user_id'  => $user->id,
            'points'   => 5,
            'activity' => 'Resolució de Dubtes',
        ]);

        $response = $this->getJson('/api/ligas/history');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonStructure([
                '*' => ['points', 'activity', 'created_at'],
            ]);
    }

    public function test_unauthenticated_user_cannot_get_history(): void
    {
        $response = $this->getJson('/api/ligas/history');

        $response->assertStatus(401);
    }

    public function test_history_only_returns_entries_for_authenticated_user(): void
    {
        $user = $this->authenticateUserWithRole('student');
        $otherUser = User::factory()->create();

        LigaPointHistory::create(['user_id' => $user->id, 'points' => 10, 'activity' => 'Presentació']);
        LigaPointHistory::create(['user_id' => $otherUser->id, 'points' => 20, 'activity' => 'Correcció de PR']);

        $response = $this->getJson('/api/ligas/history');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_history_is_returned_in_chronological_order(): void
    {
        $user = $this->authenticateUserWithRole('student');

        LigaPointHistory::create(['user_id' => $user->id, 'points' => 20, 'activity' => 'Presentació', 'created_at' => now()->subDays(2)]);
        LigaPointHistory::create(['user_id' => $user->id, 'points' => 10, 'activity' => 'Correcció de PR', 'created_at' => now()->subDay()]);
        LigaPointHistory::create(['user_id' => $user->id, 'points' => 5, 'activity' => 'Resolució de Dubtes', 'created_at' => now()]);

        $response = $this->getJson('/api/ligas/history');

        $response->assertStatus(200);

        $data = $response->json();
        $this->assertEquals(20, $data[0]['points']);
        $this->assertEquals(10, $data[1]['points']);
        $this->assertEquals(5, $data[2]['points']);
    }
}
