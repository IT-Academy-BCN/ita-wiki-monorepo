<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\ListProjects;
use App\Models\ContributorListProject;
use App\Models\User;
use App\Enums\LanguageEnum;

class ListProjectsShowTest extends TestCase
{
    use RefreshDatabase;

    protected $projectOne;
    protected $contributorOne;

    public function setUp(): void
    {
        parent::setUp();

        $this->userOne = User::factory()->create(['id' => 1]);

        $this->projectOne = ListProjects::factory()->create([
            'id' => 1,
            'title' => 'Project Alpha',
            'time_duration' => '1 month',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
            'description' => 'Project description text',
            'roadmap' => 'Project roadmap text',

        ]);

        $this->contributorOne = ContributorListProject::factory()->create([
            'user_id' => $this->userOne->id,
            'programming_role' => 'Backend Developer',
            'list_project_id' => $this->projectOne->id,
        ]);
    }



    public function test_show_existing_project_successfully(): void
    {
        $response = $this->get("/api/codeconnect/{$this->projectOne->id}");
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'success' => true,
            'data' => [
                'title' => $this->projectOne->title,
                'time_duration' => $this->projectOne->time_duration,
                'language_backend' => $this->projectOne->language_backend,
                'language_frontend' => $this->projectOne->language_frontend,
                'description' => $this->projectOne->description,
                'roadmap' => $this->projectOne->roadmap,

                'contributors' => [
                    [
                        'name' => $this->contributorOne->user->name,
                        'programming_role' => $this->contributorOne->programming_role,
                    ]
                ],
            ],
        ]);
    }


    public function test_nonexistent_project_returns_404(): void
    {
        $response = $this->get('/api/codeconnect/999');
        $response->assertStatus(404);
        $response->assertJson([
            'success' => false,
            'message' => 'Project not found'
        ]);
    }

    public function test_show_returns_description_and_roadmap(): void
    {
        $response = $this->get("/api/codeconnect/{$this->projectOne->id}");
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'description' => $this->projectOne->description,
            'roadmap' => $this->projectOne->roadmap,
        ]);
    }

}
