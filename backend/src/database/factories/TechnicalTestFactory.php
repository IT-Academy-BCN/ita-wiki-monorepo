<?php

namespace Database\Factories;

use App\Enums\DifficultyLevelEnum;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Enums\LanguageEnum;

class TechnicalTestFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(4),
            'language' => $this->faker->randomElement(
                array_values(array_filter(LanguageEnum::values(), fn($value) => $value !== LanguageEnum::Other->value))
            ),
            'description' => $this->faker->paragraph(),
            'tags' => $this->faker->randomElements(['backend', 'frontend', 'database', 'testing'], 2),
            'difficulty_level' => $this->faker->randomElement(DifficultyLevelEnum::values()),
        ];
    }
        
}