<?php

declare(strict_types=1);
namespace App\Console\Commands;
use App\Enums\LeagueTypeEnum;
use App\Models\Liga;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ProcessLeaguePromotions extends Command
{
    protected $signature = 'liga:process-promotions';
    protected $description = 'Process weekly league promotions and demotions based on points_weekly';

    public function handle(): void {
        DB::transaction(function () {
            $this->processPromotionsAndDemotions();
        });
        $this->info('League promotions and demotions processed successfully.');
    }

    private function processPromotionsAndDemotions(): void {
        $maxLeague = Liga::max('league_id');
        $updates = [];
        for ($leagueId = 1; $leagueId <= $maxLeague; $leagueId++) {
            $entries = Liga::where('league_id', $leagueId)->orderByDesc('points_weekly')->get();
            $total = $entries->count();
            if ($total < 3) {
                continue;
            }
            $topCount = (int) ceil($total * 0.33);
            $bottomCount = (int) ceil($total * 0.33);
            if ($leagueId < LeagueTypeEnum::Gold->value) {
                $entries->take($topCount)->each(function ($entry) use ($leagueId, &$updates): void {
                    $updates[$entry->id] = $leagueId + 1;
                });
            }

            if ($leagueId > LeagueTypeEnum::Bronze->value) {
                $entries->slice($total - $bottomCount)->each(function ($entry) use ($leagueId, &$updates): void {
                    $updates[$entry->id] = $leagueId - 1;
                });
            }
        }

        foreach ($updates as $entryId => $newLeagueId) {
            Liga::where('id', $entryId)->update(['league_id' => $newLeagueId, ]);
        }
    }
}