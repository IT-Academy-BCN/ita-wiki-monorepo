<?php

declare(strict_types=1);

namespace Tests\Feature\LigaTests;

use Tests\TestCase;
use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LigaGetRankingTest extends TestCase
{
    use RefreshDatabase;

    public function test_returns_empty_array_when_no_entries_exist(): void
    {
        $response = $this->getJson('/api/ligas/ranking');

        $response->assertStatus(200)
            ->assertExactJson([]);
    }

}
