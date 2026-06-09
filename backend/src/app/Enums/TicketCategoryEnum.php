<?php

declare(strict_types=1);

namespace App\Enums;

enum TicketCategoryEnum: string
{
    case Bug = 'bug';
    case Suggestion = 'suggestion';
    case Other = 'other';    

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
