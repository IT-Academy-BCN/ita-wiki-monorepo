<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketComment extends Model
{
    /** @use HasFactory<\Database\Factories\TicketCommentFactory> */
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'comment',
        'is_closing_comment'
    ];

    protected $casts = [
        'is_closing_comment' => 'boolean'
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
