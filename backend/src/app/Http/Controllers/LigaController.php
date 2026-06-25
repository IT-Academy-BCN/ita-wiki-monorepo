<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Liga;
use App\Models\LigaPointHistory;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class LigaController extends Controller
{
    public function __construct()
    {
    $this->middleware('check.permission:add liga points')->only(['addPoints']);
    $this->middleware('check.permission:trigger weekly transition')->only(['triggerWeeklyTransition']);
    }


    public function index()
    {
        $entries = Liga::with('user')
            ->orderBy('points_weekly', 'desc')
            ->get()
            ->groupBy('league_id')
            ->map(fn ($group) => $group->values()->map(fn ($entry, $index) => [
                'position'      => $index + 1,
                'user_id'       => $entry->user_id,
                'username'      => $entry->user->github_user_name,
                'points_weekly' => $entry->points_weekly,
                'league_id'     => $entry->league_id,
            ]));

        return response()->json($entries);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        if (Liga::where('user_id', $validated['user_id'])->exists()) {
            return response()->json(['error' => 'Entry already exists for this user'], 409);
        }

        $entry = Liga::create(['user_id' => $validated['user_id'],'league_id' => 1, 'points_weekly' => 0,'points' => 0]);

        return response()->json($entry, 201);
    }

    public function ranking() {
        $entries = Liga::with('user')
            ->orderBy('points', 'desc')
            ->get()
            ->values()
            ->map(fn ($entry, $index) => [
                'position'   => $index + 1,
                'user_id'    => $entry->user_id,
                'points'     => $entry->points,
                'username'   => $entry->user->github_user_name,
                'league_id'  => $entry->league_id,
                'created_at' => $entry->created_at,
                'updated_at' => $entry->updated_at,

            ]);

        return response()->json($entries);
    }

    public function history(): JsonResponse
    {
        $history = LigaPointHistory::where('user_id', auth()->id())
            ->orderBy('created_at', 'asc')
            ->get(['points', 'activity', 'created_at as date']);

        return response()->json($history);
    }

    public function addPoints(Request $request, User $user): JsonResponse
    {
        $entry = Liga::where('user_id', $user->id)->first();

        if (!$entry) {
            return response()->json([
                'message' => 'User has not opted in to the liga',
            ], 403);
        }

        $validated = $request->validate([
            'points'   => 'nullable|integer|min:1',
            'activity' => 'nullable|string|max:255',
        ]);

        $pointsToAdd = $validated['points'] ?? 5;
        $activity = $validated['activity'] ?? 'Points awarded';

         $entry->increment('points', $pointsToAdd);
         $entry->increment('points_weekly', $pointsToAdd);

        LigaPointHistory::create([
            'user_id'  => $user->id,
            'points'   => $pointsToAdd,
            'activity' => $activity,
        ]);

        $entry->refresh();

        return response()->json([
            'user_id'       => $user->id,
            'points'        => $entry->points,
            'points_weekly' => $entry->points_weekly,
        ]);
    }

    public function triggerWeeklyTransition(): JsonResponse
    {
        Artisan::call('liga:reset-weekly');
        return response()->json([
            'message' => 'Weekly transition triggered successfully',
        ]);
    }

    public function getNotification(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $latestResult = \App\Models\LeagueWeeklyResult::where('user_id', $userId)
            ->orderBy('year', 'desc')
            ->orderBy('week_number', 'desc')
            ->first();

        if (!$latestResult) {
            return response()->json(['hasChange' => false]);
        }

        $fromLeagueId = $latestResult->from_league;
        $toLeagueId = $latestResult->to_league;

        if ($fromLeagueId === $toLeagueId) {
            return response()->json(['hasChange' => false]);
        }

        $direction = $toLeagueId > $fromLeagueId ? 'up' : 'down';
        
        // Convert ID to name using the Enum if available, otherwise just mapping
        $leagueNames = [1 => 'Bronze', 2 => 'Silver', 3 => 'Gold', 4 => 'Platinum'];
        $leagueName = $leagueNames[$toLeagueId] ?? 'Desconeguda';

        return response()->json([
            'hasChange' => true,
            'direction' => $direction,
            'leagueName' => $leagueName,
            'year' => $latestResult->year,
            'week_number' => $latestResult->week_number,
        ]);
    }
}

