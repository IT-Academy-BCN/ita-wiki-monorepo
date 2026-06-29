<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Enums\LeagueTypeEnum;
use App\Models\Liga;
use App\Models\LeagueWeeklyResult;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class ProcessLeaguePromotions extends Command
{
    protected $signature = 'liga:process-promotions';
    protected $description = 'Process weekly league promotions and demotions';

    public function handle(): int
    {
        $year = now()->year;
        $weekNumber = now()->isoWeek();

        if ($this->alreadyProcessed($year, $weekNumber)) {
            return self::SUCCESS;
        }

        [$bronzeToSilver, $silverToGold, $goldToSilver, $silverToBronze] =
            $this->calculateTransitions();

        $this->applyTransitions(
            $bronzeToSilver,
            $silverToGold,
            $goldToSilver,
            $silverToBronze,
            $year,
            $weekNumber
        );

        return self::SUCCESS;
    }

    private function alreadyProcessed(int $year, int $weekNumber): bool
    {
        return LeagueWeeklyResult::where('year', $year)
            ->where('week_number', $weekNumber)
            ->exists();
    }

    private function calculateTransitions(): array
    {
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
                ->orderBy('points_weekly', 'asc')
                ->take(3)
                ->pluck('user_id')
            : collect();

        return [$bronzeToSilver, $silverToGold, $goldToSilver, $silverToBronze];
    }

    private function applyTransitions(
        Collection $bronzeToSilver,
        Collection $silverToGold,
        Collection $goldToSilver,
        Collection $silverToBronze,
        int $year,
        int $weekNumber
    ): void {
        DB::transaction(function () use (
            $bronzeToSilver, $silverToGold, $goldToSilver, $silverToBronze, $year, $weekNumber
        ) {
            $this->recordResults($bronzeToSilver, LeagueTypeEnum::Bronze, LeagueTypeEnum::Silver, $year, $weekNumber);
            $this->recordResults($silverToGold,   LeagueTypeEnum::Silver, LeagueTypeEnum::Gold,   $year, $weekNumber);
            $this->recordResults($goldToSilver,   LeagueTypeEnum::Gold,   LeagueTypeEnum::Silver, $year, $weekNumber);
            $this->recordResults($silverToBronze, LeagueTypeEnum::Silver, LeagueTypeEnum::Bronze, $year, $weekNumber);

            Liga::whereIn('user_id', $bronzeToSilver)->update(['league_id' => LeagueTypeEnum::Silver->value]);
            Liga::whereIn('user_id', $silverToGold)->update(['league_id' => LeagueTypeEnum::Gold->value]);
            Liga::whereIn('user_id', $goldToSilver)->update(['league_id' => LeagueTypeEnum::Silver->value]);
            Liga::whereIn('user_id', $silverToBronze)->update(['league_id' => LeagueTypeEnum::Bronze->value]);
        });
    }

    private function recordResults(
        Collection $userIds,
        LeagueTypeEnum $fromLeague,
        LeagueTypeEnum $toLeague,
        int $year,
        int $weekNumber
    ): void {
        foreach ($userIds as $userId) {
            LeagueWeeklyResult::insertOrIgnore([
                'user_id'     => $userId,
                'year'        => $year,
                'week_number' => $weekNumber,
                'from_league' => $fromLeague->value,
                'to_league'   => $toLeague->value,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }
    }
}