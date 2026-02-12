<?php

declare(strict_types=1);

namespace App\Enums;

enum AffectedAppEnum: string
{
    case WikiFrontend = 'wiki_frontend';
    case WikiBackend = 'wiki_backend';
    case CodeConnect = 'code_connect';
    case Other = 'other';
    
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}