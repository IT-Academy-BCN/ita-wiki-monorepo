<?php

declare(strict_types=1);

namespace App\Enums;

enum LeagueTypeEnum:int
{
    case Bronze = 1;
    case Silver = 2;
    case Gold = 3;

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}