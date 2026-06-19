<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Liga;
use Illuminate\Console\Command;

class ProcessLeaguePromotions extends Command
{
    protected $signature = 'liga:process-promotions';
    protected $description = 'Process weekly league promotions and demotions';

    public function handle(): int
    {
        $this->info('League promotion process started.');

        // Promotion/demotion logic is implemented in issue 831.
        // For every user whose league changes, call:
        //   $this->trackLeagueChange($liga, $newLeagueId);

        return self::SUCCESS;
    }

    /**
     * Saves the user's current league as previous_league_id, assigns the new league,
     * and resets the notification flag so the modal appears on next login.
     */
    public function trackLeagueChange(Liga $liga, int $newLeagueId): void
    {
        $liga->previous_league_id    = $liga->league_id->value;
        $liga->league_id             = $newLeagueId;
        $liga->notification_dismissed = false;
        $liga->save();
    }
}