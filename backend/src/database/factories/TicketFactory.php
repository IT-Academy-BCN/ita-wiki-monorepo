<?php

namespace Database\Factories;

use App\Models\User;
use App\Enums\TicketStatusEnum;
use App\Enums\TicketTypeEnum;
use App\Enums\AffectedAppEnum;
use App\Enums\AffectedFunctionEnum;
use App\Enums\TicketPriorityEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code_connect_id' => User::factory(),
            'name' => fake()->sentence(3),
            'incident_date' => fake()->date(),
            'affected_app' => fake()->randomElement(['wiki_frontend', 'wiki_backend', 'code_connect', 'other']),
            'type' => fake()->randomElement(['error', 'suggestion']),
            'affected_function' => fake()->randomElement(['login', 'challenges', 'resources', 'profile', 'technical_tests', 'code_connect', 'other']),
            'description' => fake()->paragraph(),
            'status' => 'pending',
            'priority' => fake()->randomElement(['low', 'medium', 'high', 'critical']),
        ];
        
    }
}
