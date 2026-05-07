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
    public function definition(): array
    {
        return [
            'code_connect_id'   => User::factory(),
            'name'              => fake()->sentence(3),
            'incident_date'     => fake()->date(),
            'affected_app'      => fake()->randomElement(AffectedAppEnum::values()),
            'type'              => fake()->randomElement(TicketTypeEnum::values()),
            'affected_function' => fake()->randomElement(AffectedFunctionEnum::values()),
            'description'       => fake()->paragraph(),
            'status'            => TicketStatusEnum::Pending->value,
            'priority'          => fake()->randomElement(TicketPriorityEnum::values()),
        ];
    }
}
