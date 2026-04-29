<?php

declare(strict_types=1);

namespace Tests\Feature\LigaTests;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LigaAddPointsTest extends TestCase
{
    use RefreshDatabase;

    public function test_add_points_endpoint_is_accessible(): void
    {
        $user = User::factory()->create();

        $response = $this->putJson("/api/ligas/{$user->id}/points");

        $response->assertStatus(200);
    }
}

