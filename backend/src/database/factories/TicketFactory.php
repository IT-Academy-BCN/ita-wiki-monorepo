<?php

namespace Database\Factories;

use App\Models\User;
use App\Enums\TicketStatusEnum;
use App\Enums\TicketTypeEnum;
use App\Enums\AffectedAppEnum;
use App\Enums\AffectedFunctionEnum;
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
            'name' => fake()->sentence(4),
            'incident_date' => fake()->date(),
            'affected_app' => fake()->randomElement(AffectedAppEnum::values()),
            'type' => fake()->randomElement(TicketTypeEnum::values()),
            'affected_function' => fake()->randomElement(AffectedFunctionEnum::values()),
            'description' => fake()->paragraph(),
            'status' => TicketStatusEnum::Pending->value,
            'created_by' => User::factory(),
        ];
    }
}
