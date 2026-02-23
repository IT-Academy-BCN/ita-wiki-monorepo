<?php

namespace Database\Factories;

use App\Models\ForumQuestion;
use App\Models\ListProjects;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ForumQuestionFactory extends Factory
{
    protected $model = ForumQuestion::class;

    public function definition(): array
    {
        return [
            'list_project_id' => ListProjects::factory(),
            'user_id' => User::factory(),
            'question' => $this->faker->sentence(12),
        ];
    }
}