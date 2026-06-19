<?php

declare(strict_types=1);

namespace Tests\Feature\LigaTests;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class LigaNotificationFieldsTest extends TestCase
{
    public function test_ligas_table_has_notification_tracking_columns(): void
    {
        $this->assertTrue(Schema::hasColumn('ligas', 'previous_league_id'));
        $this->assertTrue(Schema::hasColumn('ligas', 'notification_dismissed'));
    }

    public function test_notification_fields_have_correct_defaults(): void
    {
        $user = User::factory()->create();
        $liga = Liga::create(['user_id' => $user->id, 'points' => 0]);

        $this->assertNull($liga->previous_league_id);
        $this->assertFalse($liga->notification_dismissed);
    }
}
