<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ListProjects;
use App\Models\ContributorListProject;
use App\Enums\LanguageEnum;
use App\Enums\ProjectStatusEnum;

class ListProjectsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owner = \App\Models\User::first() ?? \App\Models\User::factory()->create();

        ListProjects::firstOrCreate(
            ['title' => 'Project Alpha'],
            [
                'user_id' => $owner->id,
                'description' => 'This is an example project description',
                'limit_date_inscription' => '2026-06-30',
                'dev_front_number' => 2,
                'dev_back_number' => 3,
                'time_duration' => '1 month',
                'language_backend' => LanguageEnum::PHP->value,
                'language_frontend' => LanguageEnum::JavaScript->value,
                'github_url' => 'https://github.com/example/project-alpha',
                'youtube_url' => 'https://www.youtube.com/watch?v=example',
                'roadmap' => [
                    ['task' => 'Setup structure', 'done' => true],
                    ['task' => 'Implement authentication', 'done' => false],
                ],
                'status' => ProjectStatusEnum::COMPLETED->value,
            ]
        );

        ListProjects::firstOrCreate(
            ['title' => 'Project Beta'],
            [
                'user_id' => $owner->id,
                'description' => 'This is an example project description',
                'limit_date_inscription' => '2026-07-15',
                'dev_front_number' => 2,
                'dev_back_number' => 2,
                'time_duration' => '2 months',
                'language_backend' => LanguageEnum::Python->value,
                'language_frontend' => LanguageEnum::React->value,
                'github_url' => 'https://github.com/example/project-beta',
                'youtube_url' => 'https://www.youtube.com/watch?v=example',
                'roadmap' => [
                    ['task' => 'Design database', 'done' => true],
                    ['task' => 'Create ui components', 'done' => false],
                ],
                'status' => ProjectStatusEnum::COMPLETED->value,
            ]
        );

        ListProjects::firstOrCreate(
            ['title' => 'Project Gamma'],
            [
                'user_id' => $owner->id,
                'description' => 'This is an example project description',
                'limit_date_inscription' => '2026-08-01',
                'dev_front_number' => 3,
                'dev_back_number' => 4,
                'time_duration' => '3 weeks',
                'language_backend' => LanguageEnum::Java->value,
                'language_frontend' => LanguageEnum::TypeScript->value,
                'github_url' => 'https://github.com/example/project-gamma',
                'youtube_url' => 'https://www.youtube.com/watch?v=example',
                'roadmap' => [
                    ['task' => 'Setup CI/CD pipeline', 'done' => true],
                    ['task' => 'Implement user roles', 'done' => false],
                ],
                'status' => ProjectStatusEnum::COMPLETED->value,
            ]
        );

        ListProjects::firstOrCreate(
            ['title' => 'Project Delta'],
            [
                'user_id' => $owner->id,
                'description' => 'Building a REST API with Node.js and TypeScript',
                'limit_date_inscription' => '2026-09-01',
                'dev_front_number' => 2,
                'dev_back_number' => 2,
                'time_duration' => '6 weeks',
                'language_backend' => LanguageEnum::JavaScript->value,
                'language_frontend' => LanguageEnum::TypeScript->value,
                'github_url' => null,
                'youtube_url' => null,
                'status' => ProjectStatusEnum::IN_PROGRESS->value,
                'roadmap' => [
                    ['task' => 'Define API contracts', 'done' => false],
                    ['task' => 'Implement endpoints', 'done' => false],
                ],
            ]
        );

        ListProjects::firstOrCreate(
            ['title' => 'Project Epsilon'],
            [
                'user_id' => $owner->id,
                'description' => 'Frontend dashboard with React and data visualization',
                'limit_date_inscription' => '2026-09-15',
                'dev_front_number' => 3,
                'dev_back_number' => 1,
                'time_duration' => '2 months',
                'language_backend' => LanguageEnum::Python->value,
                'language_frontend' => LanguageEnum::React->value,
                'github_url' => null,
                'youtube_url' => null,
                'status' => ProjectStatusEnum::IN_PROGRESS->value,
                'roadmap' => [
                    ['task' => 'Design mockups', 'done' => false],
                    ['task' => 'Implement charts', 'done' => false],
                ],
            ]
        );

        ListProjects::firstOrCreate(
            ['title' => 'Project Zeta'],
            [
                'user_id' => $owner->id,
                'description' => 'Mobile-first e-commerce platform with Vue and Java',
                'limit_date_inscription' => '2026-10-01',
                'dev_front_number' => 2,
                'dev_back_number' => 3,
                'time_duration' => '3 months',
                'language_backend' => LanguageEnum::Java->value,
                'language_frontend' => LanguageEnum::Vue->value,
                'github_url' => null,
                'youtube_url' => null,
                'status' => ProjectStatusEnum::IN_PROGRESS->value,
                'roadmap' => [
                    ['task' => 'Setup monorepo', 'done' => false],
                    ['task' => 'Implement cart logic', 'done' => false],
                ],
            ]
        );
    }
}
