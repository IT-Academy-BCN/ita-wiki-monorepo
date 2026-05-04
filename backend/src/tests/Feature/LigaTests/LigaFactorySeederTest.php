<?php

declare(strict_types=1);

namespace Tests\Feature\LigaTests;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LigaFactorySeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_liga_factory_creates_liga(): void
    {
        $liga = Liga::factory()->create();

        $this->assertDatabaseHas('ligas', [
            'id' => $liga->id,
            'user_id' => $liga->user_id,
        ]);
    }

    public function test_liga_factory_points_are_within_valid_range(): void
    {
        $liga = Liga::factory()->create();

        $this->assertGreaterThanOrEqual(0, $liga->points);
        $this->assertLessThanOrEqual(100, $liga->points);
    }

    public function test_liga_factory_creates_associated_user(): void
    {
        $liga = Liga::factory()->create();

        $this->assertDatabaseHas('users', ['id' => $liga->user_id]);
    }

    public function test_liga_seeder_creates_liga_for_each_existing_user(): void
    {
        $user = User::factory()->count(3)->create();

        (new \Database\Seeders\LigaSeeder())->run();

        foreach ($user as $user) {
            $this->assertDatabaseHas('ligas', ['user_id' => $user->id]);
        }
    }

    public function test_liga_seeder_does_not_duplicate_ligas(): void
    {
        $user = User::factory()->create();
        Liga::create(['user_id' => $user->id, 'points' => 50]);

        (new \Database\Seeders\LigaSeeder())->run();

        $this->assertCount(1, Liga::where('user_id', $user->id)->get());
    }

    public function test_liga_seeder_creates_five_test_ligas_via_factory(): void
    {
        (new \Database\Seeders\LigaSeeder())->run();

        $this->assertGreaterThanOrEqual(5, Liga::count());
    }
}