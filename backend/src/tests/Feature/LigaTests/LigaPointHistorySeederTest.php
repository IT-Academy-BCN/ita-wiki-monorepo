<?php

declare(strict_types=1);

namespace Tests\Feature\LigaTests;

use App\Models\LigaPointHistory;
use App\Models\User;
use Database\Seeders\LigaPointHistorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaPointHistorySeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_creates_history_entries_for_each_user(): void
    {
        User::factory()->count(3)->create();

        (new LigaPointHistorySeeder())->run();

        foreach (User::all() as $user) {
            $this->assertDatabaseHas('liga_point_histories', ['user_id' => $user->id]);
        }
    }

    public function test_seeder_creates_entries_with_positive_points(): void
    {
        User::factory()->create();

        (new LigaPointHistorySeeder())->run();

        LigaPointHistory::all()->each(function (LigaPointHistory $entry): void {
            $this->assertGreaterThan(0, $entry->points);
        });
    }
}
