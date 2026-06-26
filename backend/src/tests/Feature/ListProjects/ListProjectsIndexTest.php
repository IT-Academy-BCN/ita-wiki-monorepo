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

class ListProjectsIndexTest extends TestCase
{
    use RefreshDatabase;

    protected $projectOne;
    protected $projectTwo;
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

        $this->projectTwo = ListProjects::factory()->create([
            'id' => 2,
            'title' => 'Project Beta',
            'time_duration' => '2 months',
            'language_backend' => LanguageEnum::Python->value,
            'language_frontend' => LanguageEnum::React->value,
        ]);

        ListProjects::factory(3)->create();

        $this->contributorOne = ContributorListProject::factory()->create([
            'user_id' => $this->userOne->id,
            'programming_role' => 'Backend Developer',
            'list_project_id' => $this->projectOne->id,
        ]);
    }


    public function test_method_index_endpoint(): void
    {
        $response = $this->get('/api/codeconnect');
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'success' => true,
        ]);
    }

    public function test_method_count_projects(): void
    {
        $response = $this->get('/api/codeconnect');
        $response->assertJsonCount(5, 'data');
        $response->assertStatus(200);
    }

    public function test_index_returns_successfully(): void
    {
        $response = $this->get('/api/codeconnect');
        $response->assertJsonFragment([
            'title' => $this->projectOne->title,
            'time_duration' => $this->projectOne->time_duration,
            'language_backend' => $this->projectOne->language_backend,
            'language_frontend' => $this->projectOne->language_frontend,
            'description' => $this->projectOne->description,
            'roadmap' => $this->projectOne->roadmap,
            'status' => $this->projectOne->status->value,

            'contributors' => [
                [
                    'name' => $this->contributorOne->user->name,
                    'programming_role' => $this->contributorOne->programming_role,
                    'avatar_url' => $this->contributorOne->user->avatar_url,
                    'user_id' => $this->contributorOne->user_id,
                    'status' => $this->contributorOne->status,
                ]
            ],
        ]);

        $response->assertJsonFragment([
            'title' => $this->projectTwo->title,
            'time_duration' => $this->projectTwo->time_duration,
            'language_backend' => $this->projectTwo->language_backend,
            'language_frontend' => $this->projectTwo->language_frontend,
            'status' => $this->projectTwo->status->value,
            'contributors' => [],
        ]);

        $response->assertStatus(200);
    }

    public function test_index_returns_description_and_roadmap(): void
    {
        $response = $this->get('/api/codeconnect');
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'description' => $this->projectOne->description,
            'roadmap' => $this->projectOne->roadmap,
        ]);
    }

    public function test_index_returns_new_fields():void{
        $response = $this->get('/api/codeconnect');
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

     public function test_index_returns_owner():void{
        $response = $this->Get("/api/codeconnect");
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'owner' => [
                'id' => $this->projectOne->user->id,
                'name'=> $this->projectOne->user->name,
            ]
        ]);
    }

    public function test_index_returns_contributor_status_and_user_id(): void
    {
        $response = $this->get('/api/codeconnect');
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'contributors' => [
                [
                    'name' => $this->contributorOne->user->name,
                    'programming_role' => $this->contributorOne->programming_role,
                    'avatar_url' => $this->contributorOne->user->avatar_url,
                    'user_id' => $this->contributorOne->user_id,
                    'status' => $this->contributorOne->status,
                ]
            ],
        ]);
    }

}
