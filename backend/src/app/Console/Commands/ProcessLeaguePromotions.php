<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Enums\LeagueTypeEnum;
use App\Models\Liga;
use App\Models\LeagueWeeklyResult;
use Illuminate\Support\Facades\DB;

class ProcessLeaguePromotions extends Command
{
    protected $signature = 'liga:process-promotions';
    protected $description = 'Process weekly league promotions and demotions';

    public function handle(): int
    {
        $year = now()->year;
        $weekNumber = now()->isoWeek();

        $alreadyProcessed = LeagueWeeklyResult::where('year', $year)
            ->where('week_number', $weekNumber)
            ->exists();

        if ($alreadyProcessed) {
            return self::SUCCESS;
        }

        $bronzeCount = Liga::where('league_id', LeagueTypeEnum::Bronze->value)->count();
        $silverCount = Liga::where('league_id', LeagueTypeEnum::Silver->value)->count();
        $goldCount   = Liga::where('league_id', LeagueTypeEnum::Gold->value)->count();

        $bronzeToSilver = $bronzeCount >= 4
            ? Liga::where('league_id', LeagueTypeEnum::Bronze->value)
            ->orderBy('points_weekly', 'desc')
            ->take(3)
            ->pluck('user_id')
            : collect();

        $silverToGold = $silverCount >= 4
            ? Liga::where('league_id', LeagueTypeEnum::Silver->value)
            ->orderBy('points_weekly', 'desc')
            ->take(3)
            ->pluck('user_id')
            : collect();

        $goldToSilver = $goldCount >= 4
            ? Liga::where('league_id', LeagueTypeEnum::Gold->value)
            ->orderBy('points_weekly', 'asc')
            ->take(3)
            ->pluck('user_id')
            : collect();

        $silverToBronze = $silverCount >= 7
            ? Liga::where('league_id', LeagueTypeEnum::Silver->value)
            ->whereNotIn('user_id', $silverToGold)
            ->orderBy('points_weekly','asc')
            ->take(3)
            ->pluck('user_id')
            : collect();

        DB::transaction(function () use ($bronzeToSilver, $silverToGold, $goldToSilver, $silverToBronze, $year, $weekNumber) {
            foreach ($bronzeToSilver as $userId) {
                LeagueWeeklyResult::insertOrIgnore([
                    'user_id'     => $userId,
                    'year'        => $year,
                    'week_number' => $weekNumber,
                    'from_league' => LeagueTypeEnum::Bronze->value,
                    'to_league'   => LeagueTypeEnum::Silver->value,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }

            foreach ($silverToGold as $userId) {
                LeagueWeeklyResult::insertOrIgnore([
                    'user_id'     => $userId,
                    'year'        => $year,
                    'week_number' => $weekNumber,
                    'from_league' => LeagueTypeEnum::Silver->value,
                    'to_league'   => LeagueTypeEnum::Gold->value,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }

            foreach ($goldToSilver as $userId) {
                LeagueWeeklyResult::insertOrIgnore([
                    'user_id'     => $userId,
                    'year'        => $year,
                    'week_number' => $weekNumber,
                    'from_league' => LeagueTypeEnum::Gold->value,
                    'to_league'   => LeagueTypeEnum::Silver->value,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }

            foreach ($silverToBronze as $userId) {
                LeagueWeeklyResult::insertOrIgnore([
                    'user_id'     => $userId,
                    'year'        => $year,
                    'week_number' => $weekNumber,
                    'from_league' => LeagueTypeEnum::Silver->value,
                    'to_league'   => LeagueTypeEnum::Bronze->value,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            }

            Liga::whereIn('user_id', $bronzeToSilver)->update(['league_id' => LeagueTypeEnum::Silver->value]);
            Liga::whereIn('user_id', $silverToGold)->update(['league_id' => LeagueTypeEnum::Gold->value]);
            Liga::whereIn('user_id', $goldToSilver)->update(['league_id' => LeagueTypeEnum::Silver->value]);
            Liga::whereIn('user_id', $silverToBronze)->update(['league_id' => LeagueTypeEnum::Bronze->value]);
        });

        return self::SUCCESS;
    }
}