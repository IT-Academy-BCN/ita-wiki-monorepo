<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\LigaStatusEnum;
use App\Enums\LeagueTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Liga extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'points',
        'points_weekly',
        'status',
        'language',
        'league_id',
        'notification_dismissed',
    ];

    protected $attributes = [
        'points_weekly' => 0,
        'status' => 'Junior Coder',
        'notification_dismissed' => true,
    ];

    protected $casts = [
        'points' => 'integer',
        'points_weekly' => 'integer',
        'league_id' => LeagueTypeEnum::class,
        'status' => LigaStatusEnum::class, 
        'notification_dismissed' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}