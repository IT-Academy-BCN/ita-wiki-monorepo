<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Enums\LigaStatusEnum;
use PHPUnit\Framework\TestCase;

class LigaStatusEnumTest extends TestCase
{
    public function test_values_returns_all_status_strings(): void
    {
        $expected = ['Junior Coder', 'Senior Coder', 'Skilled Developer', 'Expert Hacker'];

        $this->assertSame($expected, LigaStatusEnum::values());
    }

    public function test_each_case_has_correct_string_value(): void
    {
        $this->assertSame('Junior Coder',      LigaStatusEnum::JuniorCoder->value);
        $this->assertSame('Senior Coder',      LigaStatusEnum::SeniorCoder->value);
        $this->assertSame('Skilled Developer', LigaStatusEnum::SkilledDeveloper->value);
        $this->assertSame('Expert Hacker',     LigaStatusEnum::ExpertHacker->value);
    }

    public function test_enum_can_be_created_from_valid_value(): void
    {
        $this->assertSame(LigaStatusEnum::JuniorCoder,      LigaStatusEnum::from('Junior Coder'));
        $this->assertSame(LigaStatusEnum::SeniorCoder,      LigaStatusEnum::from('Senior Coder'));
        $this->assertSame(LigaStatusEnum::SkilledDeveloper, LigaStatusEnum::from('Skilled Developer'));
        $this->assertSame(LigaStatusEnum::ExpertHacker,     LigaStatusEnum::from('Expert Hacker'));
    }
}
