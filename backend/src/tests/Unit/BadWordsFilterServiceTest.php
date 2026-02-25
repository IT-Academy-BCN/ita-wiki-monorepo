<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\BadWordsFilterService;

class BadWordsFilterServiceTest extends TestCase
{
    private BadWordsFilterService $filter;

    protected function setUp(): void
    {
        parent::setUp();

        $this->filter = new BadWordsFilterService([
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
        ]);
    }

    public function test_it_replaces_exact_bad_word()
    {
        $result = $this->filter->filter('Eres una puta');

        $this->assertEquals('Eres una ***', $result);
    }

    public function test_it_is_case_insensitive()
    {
        $result = $this->filter->filter('Eres una PUTA');

        $this->assertEquals('Eres una ***', $result);
    }

    public function test_it_does_not_replace_partial_words()
    {
        $result = $this->filter->filter('computadora');

        $this->assertEquals('computadora', $result);
    }

    public function test_it_replaces_multiple_occurrences()
    {
        $result = $this->filter->filter('puta mierda');

        $this->assertEquals('*** ***', $result);
    }

    public function test_clean_text_remains_unchanged()
    {
        $result = $this->filter->filter('Hola mundo');

        $this->assertEquals('Hola mundo', $result);
    }
}