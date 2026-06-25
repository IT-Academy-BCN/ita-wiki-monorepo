<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\LanguageEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ListProjects>
 */
class ListProjectsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $languages = LanguageEnum::values();

        return [
            'user_id' => \App\Models\User::factory(),
            'title' => $this->faker->sentence(3),
            'description'=> $this->faker->paragraph(),
            'limit_date_inscription' => $this->faker->optional()->dateTimeBetween('now', '+3 months')?->format('Y-m-d'),
            'start_date' => $this->faker->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
            'end_date' => $this->faker->dateTimeBetween('+1 month', '+6 months')->format('Y-m-d'),
            'dev_front_number' => $this->faker->optional()->numberBetween(1, 5),
            'dev_back_number' => $this->faker->optional()->numberBetween(1, 5),
            'time_duration' => $this->faker->word(),
            'language_backend' => $this->faker->randomElement($languages),
            'language_frontend' => $this->faker->randomElement($languages),
            'github_url' => $this->faker->optional()->url(),
            'youtube_url' => $this->faker->optional()->url(),
            'roadmap'=> $this->faker->optional()->passthrough([
                ['task' => $this->faker->sentence(3), 'done' => $this->faker->boolean()],
                ['task' => $this->faker->sentence(3), 'done' => $this->faker->boolean()],
            ])
        ];
    }
}
