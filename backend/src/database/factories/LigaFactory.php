<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\LanguageEnum;
use App\Enums\LigaStatusEnum;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Liga>
 */
class LigaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'       => User::factory(),
            'points'        => $this->faker->numberBetween(0, 100),
            'points_weekly' => $this->faker->numberBetween(0, 100),
            'language'      => $this->faker->randomElement(LanguageEnum::values()),
            'status'        => $this->faker->randomElement(LigaStatusEnum::values()),
            'league_id'     => $this->faker->numberBetween(1, 4),
        ];
    }
}
