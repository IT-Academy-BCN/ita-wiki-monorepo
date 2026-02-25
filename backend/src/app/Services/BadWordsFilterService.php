<?php

namespace App\Services;

class BadWordsFilterService
{
    private array $badWords;

      private const DEFAULT_BAD_WORDS = [ 
             'asesinato',
            'asno',
            'bastardo',
            'bollera',
            'cabrón',
            'caca',
            'chupada',
            'chupapollas',
            'chupetón',
            'concha',
            'concha de tu madre',
            'coño',
            'coprofagía',
            'culo',
            'drogas',
            'esperma',
            'fiesta de salchichas',
            'follador',
            'follar',
            'gilipichis',
            'gilipollas',
            'hacer una paja',
            'haciendo el amor',
            'heroína',
            'hija de puta',
            'hijaputa',
            'hijo de puta',
            'hijoputa',
            'idiota',
            'imbécil',
            'infierno',
            'jilipollas',
            'kapullo',
            'lameculos',
            'maciza',
            'macizorra',
            'maldito',
            'mamada',
            'marica',
            'maricón',
            'mariconazo',
            'mierda',
            'nazi',
            'orina',
            'pedo',
            'pendejo',
            'pervertido',
            'pezón',
            'pinche',
            'pis',
            'prostituta',
            'puta',
            'racista',
            'ramera',
            'sádico',
            'semen',
            'sexo',
            'sexo oral',
            'soplagaitas',
            'soplapollas',
            'tetas grandes',
            'tía buena',
            'travesti',
            'trio',
            'verga',
            'vete a la mierda',
            'vulva',
      ];

    public function __construct(array $badWords = self::DEFAULT_BAD_WORDS)
    {
        $this->badWords = $badWords;
    }

    public function filter(string $text): string
    {
        if (empty($this->badWords)) {
        return $text;
        }

        $escapedWords = array_map(
        fn($word) => preg_quote(mb_strtolower($word), '/'),
        $this->badWords
        );

        $pattern = '/\b(' . implode('|', $escapedWords) . ')\b/iu';

        return preg_replace($pattern, '***', $text) ?? $text;
    }
}