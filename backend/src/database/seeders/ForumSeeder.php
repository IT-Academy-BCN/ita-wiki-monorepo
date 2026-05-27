<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ForumQuestion;
use App\Models\ForumAnswer;
use App\Models\ListProjects;
use App\Models\User;

class ForumSeeder extends Seeder
{
    public function run(): void
    {
        $projects = ListProjects::all();
        $users = User::all();

        foreach ($projects as $project) {
            ForumQuestion::factory()
                ->count(2)
                ->create([
                    'list_project_id' => $project->id,
                    'user_id' => $users->random()->id,
                ])
                ->each(function ($question) use ($users) {
                    ForumAnswer::factory()
                        ->count(2)
                        ->create([
                            'forum_question_id' => $question->id,
                            'user_id' => $users->random()->id,
                        ]);
                });
        }
    }
}
