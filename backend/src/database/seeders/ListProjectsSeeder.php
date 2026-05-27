<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ListProjects;
use App\Models\ContributorListProject;
use App\Enums\LanguageEnum;

class ListProjectsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owner = \App\Models\User::first() ?? \App\Models\User::factory()->create();
        $Project1 = ListProjects::firstOrCreate([
            'user_id' => $owner->id,
            'title' => 'Project Alpha'],
            [
                'description' => 'This is an example project description',
                'limit_date_inscription' => '2026-06-30',
                'dev_front_number' => 2,
                'dev_back_number' => 3,
                'time_duration' => '1 month',
                'language_backend' => LanguageEnum::PHP->value,
                'language_frontend' => LanguageEnum::JavaScript->value,
                'roadmap' => [
                    ['task' => 'Setup structure', 'done' => true],
                    ['task' => 'Implement authentication', 'done' => false],
                ],
            ]
        );

        $Project2 = ListProjects::firstOrCreate([
            'user_id' => $owner->id,
            'title' => 'Project Beta'],
            [
                'description' => 'This is an example project description',
                'limit_date_inscription' => '2026-07-15',
                'dev_front_number' => 2,
                'dev_back_number' => 2,
                'time_duration' => '2 months',
                'language_backend' => LanguageEnum::Python->value,
                'language_frontend' => LanguageEnum::React->value,
                'roadmap' => [
                    ['task' => 'Design database', 'done' => true],
                    ['task' => 'Create ui components', 'done' => false],
                ],
            ]
        );
        
        $project3 = ListProjects::firstOrCreate([
            'user_id' => $owner->id,
            'title' => 'Project Gamma'],
            [
                'description' => 'This is an example project description',
                'limit_date_inscription' => '2026-08-01',
                'dev_front_number' => 3,
                'dev_back_number' => 4,
                'time_duration' => '3 weeks',
                'language_backend' => LanguageEnum::Java->value,
                'language_frontend' => LanguageEnum::TypeScript->value,
                'roadmap' => [
                    ['task' => 'Setup CI/CD pipeline', 'done' => true],
                    ['task' => 'Implement user roles', 'done' => false],
                ],
            ]
        );
    }
}
