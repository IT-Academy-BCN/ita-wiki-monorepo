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
        $minUsersToProcess = 4;
        $allLeagues = Liga::all();
        $bronzeLeagues = $allLeagues->where('league_id', 1);
        $silverLeagues = $allLeagues->where('league_id', 2);
        $goldLeagues = $allLeagues->where('league_id', 3);

        $bronzeToSilver = $bronzeLeagues->count() >= $minUsersToProcess
            ? $bronzeLeagues->sortByDesc('points_weekly')->take(3)->pluck('id')
            : collect();

        $silverToGold = $silverLeagues->count() >= $minUsersToProcess
            ? $silverLeagues->sortByDesc('points_weekly')->take(3)->pluck('id')
            : collect();

        $goldToSilver = $goldLeagues->count() >= $minUsersToProcess
            ? $goldLeagues->sortBy('points_weekly')->take(3)->pluck('id')
            : collect();

        $silverToBronze = $silverLeagues->count() >= $minUsersToProcess
            ? $silverLeagues->whereNotIn('id', $silverToGold)->sortBy('points_weekly')->take(3)->pluck('id')
            : collect();

        \Illuminate\Support\Facades\DB::transaction(function () use ($bronzeToSilver, $silverToGold, $goldToSilver, $silverToBronze) {
            if ($bronzeToSilver->isNotEmpty()) {
                Liga::whereIn('id', $bronzeToSilver)->update(['league_id' => 2]);
            }
            if ($silverToGold->isNotEmpty()) {
                Liga::whereIn('id', $silverToGold)->update(['league_id' => 3]);
            }
            if ($goldToSilver->isNotEmpty()) {
                Liga::whereIn('id', $goldToSilver)->update(['league_id' => 2]);
            }
            if ($silverToBronze->isNotEmpty()) {
                Liga::whereIn('id', $silverToBronze)->update(['league_id' => 1]);
            }
        });

        return self::SUCCESS;
    }
}
