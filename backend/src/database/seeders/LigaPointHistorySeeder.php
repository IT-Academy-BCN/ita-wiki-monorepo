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
        $entries = [
            ['activity' => 'Resolució de Dubtes', 'points' => 5],
            ['activity' => 'Resolució de Dubtes', 'points' => 5],
            ['activity' => 'Resolució de Dubtes', 'points' => 5],
            ['activity' => 'Correcció de PR',     'points' => 10],
            ['activity' => 'Correcció de PR',     'points' => 10],
            ['activity' => 'Presentació',          'points' => 20],
        ];

        User::all()->each(function (User $user) use ($entries): void {
            foreach ($entries as $entry) {
                LigaPointHistory::create([
                    'user_id'  => $user->id,
                    'points'   => $entry['points'],
                    'activity' => $entry['activity'],
                ]);
            }
        });
    }
}
