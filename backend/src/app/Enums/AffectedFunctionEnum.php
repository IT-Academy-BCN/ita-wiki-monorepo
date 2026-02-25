<?php

declare(strict_types=1);

namespace App\Enums;

enum AffectedFunctionEnum: string
{
    case Login = 'login';
    case Challenges = 'challenges';
    case Resources = 'resources';
    case Profile = 'profile';
    case TechnicalTests = 'technical_tests';
    case CodeConnect = 'code_connect';
    case Other = 'other';
    
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}