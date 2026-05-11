<?php

declare(strict_types=1);

namespace App\Enums;

enum LigaStatusEnum: string
{
    case JuniorCoder      = 'Junior Coder';
    case SeniorCoder      = 'Senior Coder';
    case SkilledDeveloper = 'Skilled Developer';
    case ExpertHacker     = 'Expert Hacker';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
