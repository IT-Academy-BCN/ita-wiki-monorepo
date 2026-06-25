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
            'user_id' => $this->userOne->id,
            'title' => 'Project Alpha',
            'time_duration' => '1 month',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
            'description' => 'Project description text',
            'roadmap' => [['task' => 'Setup project', 'done' => true]],
            'start_date' => '2026-06-01',
            'end_date' => '2026-12-31',
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
                'id' => $this->projectOne->id,
                'user_id' => $this->projectOne->user_id,
                'limit_date_inscription' => $this->projectOne->limit_date_inscription,
                'start_date' => '2026-06-01',
                'end_date' => '2026-12-31',
                'dev_front_number' => $this->projectOne->dev_front_number,
                'dev_back_number' => $this->projectOne->dev_back_number,    
                'title' => $this->projectOne->title,
                'time_duration' => $this->projectOne->time_duration,
                'language_backend' => $this->projectOne->language_backend,
                'language_frontend' => $this->projectOne->language_frontend,
                'description' => $this->projectOne->description,
                'roadmap' => $this->projectOne->roadmap,
                'status' => $this->projectOne->status->value, // <--- temporary to be deleted after 869 PR approval --->
                'owner' => [
                    'id' => $this->projectOne->user->id,
                    'name' => $this->projectOne->user->name,
                ],
                'contributors' => [
                    [
                        'id' => $this->contributorOne->id,
                        'user_id' => $this->contributorOne->user_id,
                        'name' => $this->contributorOne->user->name,
                        'programming_role' => $this->contributorOne->programming_role,
                        'avatar_url' => $this->contributorOne->user->avatar_url,
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

    public function test_show_returns_new_fields():void{
        $response = $this->get("/api/codeconnect/{$this->projectOne->id}");
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'user_id' => $this->projectOne->user_id,
            'limit_date_inscription' => $this->projectOne->limit_date_inscription,
            'start_date' => '2026-06-01',
            'end_date' => '2026-12-31',
            'dev_front_number' => $this->projectOne->dev_front_number,
            'dev_back_number' => $this->projectOne->dev_back_number,
        ]);
    }

    public function test_show_returns_owner():void{
        $response = $this->Get("/api/codeconnect/{$this->projectOne->id}");
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'owner' => [
                'id' => $this->projectOne->user->id,
                'name'=> $this->projectOne->user->name,
            ]
        ]);
    }

}
