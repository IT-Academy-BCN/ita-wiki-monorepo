<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\ListProjects;
use App\Models\ContributorListProject;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use App\Enums\LanguageEnum;
use App\Enums\ContributorStatusEnum;

class ListProjectsStoreTest extends TestCase
{
    use RefreshDatabase;

    protected $projectOne;
    protected $userOne;

    public function setUp(): void
    {
        parent::setUp();

        $this->userOne = User::factory()->create();

        $this->projectOne = ListProjects::factory()->create([
            'id' => 1,
            'title' => 'Project Alpha',
            'time_duration' => '1 month',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
        ]);
    }

    public function test_method_store_successfully(): void
    {

        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'Proyecto Beta',
            'time_duration' => '1 mes',
            'language_backend' => LanguageEnum::Python->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
        ]);

        $response->assertJsonFragment([
            'success' => true,
            'message' => 'Project created successfully',
        ]);

        $response->assertStatus(201);
    }

    public function test_method_datas_not_valid_language(): void
    {

        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'project invalid',
            'time_duration' => '1 month',
            'language_backend' => 'pokemon',
            'language_frontend' => LanguageEnum::JavaScript->value,
        ]);

        $response->assertJsonFragment([
            'success' => false,
            'message' => 'Invalid Backend language',
        ]);

        $response->assertStatus(400);
    }

    public function test_method_datas_error_required(): void
    {

        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'project invalid',
            'time_duration' => '',
            'language_backend' => LanguageEnum::Python->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
        ]);
        $response->assertStatus(422);
    }

    public function test_store_requires_authentication(): void
    {

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'Proyecto Gamma',
            'time_duration' => '1 mes',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
        ]);

        $response->assertStatus(401);
        $response->assertJson([
            'message' => 'Unauthenticated.',
        ]);
    }

    public function test_project_creator_is_added_as_contributor(): void
    {
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'Proyecto Delta',
            'time_duration' => '2 months',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
        ]);

        $response->assertStatus(201);

        $project = ListProjects::where('title', 'Proyecto Delta')->firstOrFail();

        $this->assertDatabaseHas('contributors_list_project', [
            'list_project_id' => $project->id,
            'user_id' => $this->userOne->id,
            'status' => ContributorStatusEnum::Accepted->value,
        ]);
    }

    public function test_store_response_includes_contributor(): void
    {
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'Proyecto Epsilon',
            'time_duration' => '1 mes',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'data' => [
                'contributor_list_project' => [
                    '*' => [
                        'id',
                        'list_project_id',
                        'user_id',
                        'programming_role',
                        'status',
                    ]
                ]
            ]
        ]);
    }

}
