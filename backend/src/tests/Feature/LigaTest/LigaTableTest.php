<?php

declare(strict_types=1);

namespace Tests\Feature\Liga;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class LigaTableTest extends TestCase
{
    use RefreshDatabase;

    public function test_ligas_table_has_new_fields(): void
    {
        $this->assertTrue(Schema::hasColumn('ligas', 'points_weekly'));
        $this->assertTrue(Schema::hasColumn('ligas', 'status'));
        $this->assertTrue(Schema::hasColumn('ligas', 'language'));
        $this->assertTrue(Schema::hasColumn('ligas', 'league_id'));
    }

    public function test_points_weekly_defaults_to_zero(): void
    {
        $user = User::factory()->create();

        $liga = Liga::create([
            'user_id' => $user->id,
            'points'  => 0,
        ]);

        $this->assertEquals(0, $liga->points_weekly);
    }

   
    public function test_liga_can_be_created_with_new_fields(): void
    {
        $user = User::factory()->create();
    
        $liga = Liga::create([
            'user_id'       => $user->id,
            'points'        => 10,
            'points_weekly' => 5,
            'status'        => 'Junior Coder',
            'language'      => 'PHP',
            'league_id'     => 1,
        ]);
    
        $this->assertEquals(5, $liga->points_weekly);
        $this->assertEquals('PHP', $liga->language);
        $this->assertEquals(1, $liga->league_id);
    
        $statusValue = $liga->status instanceof \BackedEnum
            ? $liga->status->value
            : $liga->status;
        $this->assertEquals('Junior Coder', $statusValue);
    }

    public function test_status_defaults_to_junior_coder(): void
    {
        $user = User::factory()->create();

        $liga = Liga::create([
            'user_id' => $user->id,
            'points'  => 0,
        ]);

        $statusValue = $liga->status instanceof \BackedEnum
            ? $liga->status->value
            : $liga->status;
        $this->assertEquals('Junior Coder', $statusValue);
    }

    public function test_existing_fields_are_not_affected(): void
    {
        $user = User::factory()->create();

        $liga = Liga::create([
            'user_id' => $user->id,
            'points'  => 20,
        ]);

        $this->assertEquals($user->id, $liga->user_id);
        $this->assertEquals(20, $liga->points);
    }
}