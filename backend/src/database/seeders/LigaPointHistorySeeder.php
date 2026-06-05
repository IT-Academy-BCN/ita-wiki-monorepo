<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\LigaPointHistory;
use App\Models\User;
use Illuminate\Database\Seeder;

class LigaPointHistorySeeder extends Seeder
{
    public function run(): void
    {
        $activities = [
            'Resolució de Dubtes',
            'Correcció de PR',
            'Presentació',
        ];

        User::all()->each(function (User $user) use ($activities): void {
            foreach (array_slice($activities, 0, fake()->numberBetween(1, 3)) as $activity) {
                LigaPointHistory::create([
                    'user_id'  => $user->id,
                    'points'   => fake()->numberBetween(5, 50),
                    'activity' => $activity,
                ]);
            }
        });
    }
}
