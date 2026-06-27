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

Schedule::command('liga:process-promotions')
    ->weeklyOn(0, '00:00')
    ->then(function () {
        Artisan::call('liga:reset-weekly');
    });