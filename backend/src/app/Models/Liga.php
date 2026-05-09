<?php

declare(strict_types=1);

namespace App\Models;

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
        'user_name',
        'status',
        'language',
        'league_id',
    ];

    protected $attributes = [
        'points_weekly' => 0,
        'status'        => 'Junior Coder',
    ];

    protected $casts = [
        'points'        => 'integer',
        'points_weekly' => 'integer',
        'league_id'     => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}