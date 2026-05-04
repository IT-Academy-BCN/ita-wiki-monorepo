<?php 

declare(strict_types=1);

namespace Database\Factories;

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
            'user_id' => User::factory(),
            'points' => fake()->numberBetween(0, 100),
        ];
    }
}
