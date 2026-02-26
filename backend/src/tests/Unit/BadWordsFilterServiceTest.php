<?php

namespace Tests\Unit;

use App\Services\BadWordsFilterService;
use Tests\TestCase;

class BadWordsFilterServiceTest extends TestCase
{
    private BadWordsFilterService $filter;

    protected function setUp(): void
    {
        parent::setUp();

      
        $this->filter = new BadWordsFilterService();
    }

    public function test_it_replaces_exact_bad_word(): void
    {
        $result = $this->filter->filter('Eres una puta');

        $this->assertEquals('Eres una ***', $result);
    }

    public function test_it_is_case_insensitive(): void
    {
        $result = $this->filter->filter('Eres una PUTA');

        $this->assertEquals('Eres una ***', $result);
    }

    public function test_it_does_not_replace_partial_words(): void
    {
        $result = $this->filter->filter('computadora');

        $this->assertEquals('computadora', $result);
    }

    public function test_it_replaces_multiple_occurrences(): void
    {
        $result = $this->filter->filter('puta mierda');

        $this->assertEquals('*** ***', $result);
    }

    public function test_it_replaces_multi_word_phrase(): void
    {
        $result = $this->filter->filter('Eres una concha de tu madre');

        $this->assertEquals('Eres una ***', $result);
    }

    public function test_it_replaces_accented_word(): void
    {
        $result = $this->filter->filter('Eres un cabrón');

        $this->assertEquals('Eres un ***', $result);
    }

    public function test_empty_string_remains_unchanged(): void
    {
        $result = $this->filter->filter('');

        $this->assertEquals('', $result);
    }

    public function test_empty_list_returns_same_text(): void
    {
        $filter = new BadWordsFilterService([]);

        $result = $filter->filter('Hola mundo');

        $this->assertEquals('Hola mundo', $result);
    }
}