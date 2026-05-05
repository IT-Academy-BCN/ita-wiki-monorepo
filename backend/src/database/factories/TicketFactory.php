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
            'affected_app' => fake()->randomElement(AffectedAppEnum::values()),
            'type' => fake()->randomElement(['error', 'suggestion']),
            'affected_function' => fake()->randomElement(AffectedFunctionEnum::values()),
            'description' => fake()->paragraph(),
            'status' => TicketStatusEnum::Pending->value,
            'priority' => fake()->randomElement(TicketPriorityEnum::values()),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => [
            'status' => TicketStatusEnum::Pending->value,
        ]);
    }

    public function inProgress(): static
    {
        return $this->state(fn () => [
            'status' => TicketStatusEnum::InProgress->value,
            'assignee_id' => User::factory(),
        ]);
    }

    public function blocked(): static
    {
        return $this->state(fn () => [
            'status' => TicketStatusEnum::Blocked->value,
            'assignee_id' => User::factory(),
        ]);
    }

    public function ready(): static
    {
        return $this->state(fn () => [
            'status' => TicketStatusEnum::Ready->value,
            'assignee_id' => User::factory(),
        ]);
    }

    public function closed(): static
    {
        return $this->state(fn () => [
            'status' => TicketStatusEnum::Closed->value,
            'assignee_id' => User::factory(),
            'closed_by' => User::factory(),
            'closed_at' => now(),
        ]);
    }
}
