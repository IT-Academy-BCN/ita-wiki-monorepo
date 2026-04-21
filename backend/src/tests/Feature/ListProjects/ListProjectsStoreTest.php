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
            'language_frontend' => LanguageEnum::JavaScript->value,
            'programming_role' => 'Backend Developer',
            'programming_role' => 'Backend Developer'
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
            'programming_role' => 'Backend Developer',
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
            'programming_role' => 'Backend Developer',
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
            'language_frontend' => LanguageEnum::JavaScript->value,
            'programming_role' => 'Backend Developer',
            'programming_role' => 'Backend Developer'
        ]);

        $response->assertStatus(201);

        $project = ListProjects::where('title', 'Proyecto Delta')->firstOrFail();

        $this->assertDatabaseHas('contributors_list_project', [
            'list_project_id' => $project->id,
            'user_id' => $this->userOne->id,
            'status' => ContributorStatusEnum::Accepted->value,
        ]);
    }

    public function test_store_uses_specified_programming_role(): void
    {
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'Proyecto Zeta',
            'time_duration' => '1 mes',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
            'programming_role' => 'Fullstack Developer',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('contributors_list_project', [
            'user_id' => $this->userOne->id,
            'programming_role' => 'Fullstack Developer',
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
            'language_frontend' => LanguageEnum::JavaScript->value,
            'programming_role' => 'Backend Developer',
            'programming_role' => 'Backend Developer'
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

    public function test_store_requires_programming_role(): void
    public function test_store_saves_programming_role_from_request(): void 
    {
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'Proyecto Sin Rol',
            'time_duration' => '1 mes',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['programming_role']);
            'title' => 'Proyecto Frontend',
            'time_duration' => '1 mes',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
            'programming_role' => 'Frontend Developer',
        ]);

        $response->assertStatus(201);

        $project = ListProjects::where('title', 'Proyecto Frontend')->firstOrFail();

        $this->assertDatabaseHas('contributors_list_project', [
            'list_project_id' => $project->id,
            'user_id' => $this->userOne->id,
            'programming_role' => 'Frontend Developer',
        ]);
    }

    public function test_store_with_new_fields_succesfully():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'Project with new fields',
            'description' => 'Project with new fields',
            'limit_date_inscription' => '2026-12-31',
            'dev_front_number' => 2,
            'dev_back_number' => 2,
            'time_duration' => '1 month',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
            'programming_role' => 'Backend Developer',
        ]);

        $response->assertStatus(201);
        $response->assertJsonFragment([
            'success' => true,
            'message' => 'Project created successfully',
        ]);
    }

    public function test_description_must_be_a_string():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'Invalid project',
            'description' => ['not', 'a', 'string'],
            'time_duration' => '1 month',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
        ]);

        $response->assertStatus(422);
    }

    public function test_limit_date_inscription_must_be_a_valid_date():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'Invalid project',
            'limit_date_inscription' => 'invalid-date',
            'time_duration' => '1 month',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
        ]);

        $response->assertStatus(422);
    }

    public function test_limit_date_inscription_must_be_today_or_future():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'Invalid project',
            'limit_date_inscription' => '2026-04-15',
            'time_duration' => '1 month',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
        ]);

        $response->assertStatus(422);
    }

    public function test_dev_front_number_must_be_an_integer():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'Invalid project',
            'dev_front_number' => 'two',
            'time_duration' => '1 month',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
        ]);

        $response->assertStatus(422);
    }

    public function test_dev_front_number_must_be_at_least_1():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'Invalid project',
            'dev_front_number' => 0,
            'time_duration' => '1 month',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
        ]);

        $response->assertStatus(422);
    }

    public function test_dev_back_number_must_be_an_integer():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'Invalid project',
            'dev_back_number' => 'two',
            'time_duration' => '1 month',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
        ]);

        $response->assertStatus(422);
    }

    public function test_dev_back_number_must_be_at_least_1():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', [
            'title' => 'Invalid project',
            'dev_back_number' => 0,
            'time_duration' => '1 month',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
        ]);

        $response->assertStatus(422);
    }
}
