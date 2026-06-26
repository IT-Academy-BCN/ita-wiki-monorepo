<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('liga:reset-weekly', function () {
    \App\Models\Liga::query()->update(['points_weekly' => 0]);
    $this->info('liga:reset-weekly');
})->purpose('Reset weekly points for all liga entries');

Artisan::command('liga:process-promotions', function () {
    app(\App\Console\Commands\ProcessLeaguePromotions::class)->handle();
})->purpose('Process weekly league promotions and demotions');

Schedule::command('liga:reset-weekly')->weeklyOn(0, '00:00');