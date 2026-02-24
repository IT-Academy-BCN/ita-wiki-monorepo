<?php

declare(strict_types=1);

namespace App\Enums;

enum TicketStatusEnum: string
{
    case Pending = 'pending';
    case InProgress = 'in_progress';
    case Blocked = 'blocked';
    case Ready = 'ready';
    case Closed = 'closed';
    
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}