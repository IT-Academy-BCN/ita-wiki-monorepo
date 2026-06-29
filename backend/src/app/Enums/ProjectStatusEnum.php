<?php

declare(strict_types=1);

namespace App\Enums;

enum ProjectStatusEnum: string
{
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
