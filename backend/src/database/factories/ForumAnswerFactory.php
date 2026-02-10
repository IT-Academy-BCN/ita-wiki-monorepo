<?php

namespace Database\Factories;

use App\Models\ForumAnswer;
use App\Models\ForumQuestion;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ForumAnswerFactory extends Factory
{
    protected $model = ForumAnswer::class;

    public function definition(): array
    {
        return [
            'forum_question_id' => ForumQuestion::factory(),
            'user_id' => User::factory(),
            'answer' => $this->faker->paragraph(2),
        ];
    }
}
