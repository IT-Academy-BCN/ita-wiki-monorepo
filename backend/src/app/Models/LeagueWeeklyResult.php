<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\LeagueTypeEnum;

class LeagueWeeklyResult extends Model
{
     protected $fillable = [
        'user_id',
        'year',
        'week_number',
        'from_league',
        'to_league',
    ];

    protected $casts = [
        'from_league' => LeagueTypeEnum::class,
        'to_league' => LeagueTypeEnum::class,
    ];
}
