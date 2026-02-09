<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Enums\TicketStatusEnum;
use App\Enums\TicketTypeEnum;
use App\Enums\TicketPriorityEnum;
use App\Enums\AffectedAppEnum;
use App\Enums\AffectedFunctionEnum;

class Ticket extends Model
{
    /** @use HasFactory<\Database\Factories\TicketFactory> */
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'incident_date',
        'affected_app',
        'type',
        'affected_function',
        'description',
        'status',
        'priority',
        'assigned_team_id',
        'created_by',
        'assigned_by',
        'closing_comment',
        'closed_by',
        'closed_at'
    ];

    protected $casts = [
        'incident_date' => 'date',
        'status' => TicketStatusEnum::class,
        'type' => TicketTypeEnum::class,
        'priority' => TicketPriorityEnum::class,
        'affected_app' => AffectedAppEnum::class,
        'affected_function' => AffectedFunctionEnum::class,
        'closed_at' => 'datetime'
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignedTeam(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'assigned_team_id');
    }

    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    public function closedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'closed_by');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(TicketComment::class);
    }
    
}
