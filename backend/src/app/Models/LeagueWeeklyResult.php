<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeagueWeeklyResult extends Model
{
     protected $fillable = [
        'user_id',
        'week_date',
        'from_league',
        'to_league',
    ];

    protected $casts = [
        'week_date' => 'date',
        'from_league' => 'integer',
        'to_league' => 'integer',
    ];
}
