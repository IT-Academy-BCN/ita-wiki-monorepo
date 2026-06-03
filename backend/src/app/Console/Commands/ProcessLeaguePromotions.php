<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ProcessLeaguePromotions extends Command
{
    protected $signature = 'liga:process-promotions';
    protected $description = 'Process weekly league promotions and demotions';

    public function handle(): int
    {
        $this->info('League promotion process started.');

        return self::SUCCESS;
    }
}