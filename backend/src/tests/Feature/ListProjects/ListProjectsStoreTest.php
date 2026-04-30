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

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload([
            'language_backend' => LanguageEnum::PHP->value,
        ]));

        $response->assertJsonFragment([
            'success' => true,
            'message' => 'Project created successfully',
        ]);

        $response->assertStatus(201);
    }

    public function test_method_datas_not_valid_language(): void
    {

        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/',  $this->validProjectPayload([
            'language_backend' => 'pokemon',
        ]));

        $response->assertJsonFragment([
            'success' => false,
            'message' => 'Invalid Backend language',
        ]);

        $response->assertStatus(400);
    }

    public function test_method_datas_error_required(): void
    {

        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/',  $this->validProjectPayload([
            'time_duration' => '',
        ]));

        $response->assertStatus(422);
    }

    public function test_store_requires_authentication(): void
    {

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload());

        $response->assertStatus(401);
        $response->assertJson([
            'message' => 'Unauthenticated.',
        ]);
    }

    public function test_project_creator_is_added_as_contributor(): void
    {
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload([
            'title' => 'Proyecto Delta',
        ]));

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

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload([
            'programming_role' => 'Fullstack Developer',
        ]));

        $response->assertStatus(201);

        $this->assertDatabaseHas('contributors_list_project', [
            'user_id' => $this->userOne->id,
            'programming_role' => 'Fullstack Developer',
        ]);
    }

    public function test_store_response_includes_contributor(): void
    {
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload());

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

    public function test_store_returns_custom_message_when_programming_role_missing(): void
    {
        Sanctum::actingAs($this->userOne);

        $payload = $this->validProjectPayload();
        unset($payload['programming_role']);
        $response = $this->postJson('/api/codeconnect/', $payload);

        $response->assertStatus(422);
        $response->assertJsonFragment([
            'programming_role' => ['The programming role field is required.'],
        ]);
    }

    public function test_store_requires_programming_role(): void
    {
        Sanctum::actingAs($this->userOne);

        $payload = $this->validProjectPayload();
        unset($payload['programming_role']);
        $response = $this->postJson('/api/codeconnect/', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['programming_role']);
    }


    public function test_store_saves_programming_role_from_request(): void
    {
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload([
            'title' => 'Proyecto Frontend',
            'programming_role' => 'Frontend Developer',
        ]));

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

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload());

        $response->assertStatus(201);
        $response->assertJsonFragment([
            'success' => true,
            'message' => 'Project created successfully',
        ]);
    }

    public function test_description_must_be_a_string():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload([
            'description' => ['not', 'a', 'string'],
        ]));

        $response->assertStatus(422);
    }

    public function test_limit_date_inscription_must_be_a_valid_date():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload([
            'limit_date_inscription' => 'invalid-date',
        ]));

        $response->assertStatus(422);
    }

    public function test_limit_date_inscription_must_be_today_or_future():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload([
            'limit_date_inscription' => '2026-04-15',
        ]));

        $response->assertStatus(422);
    }

    public function test_dev_front_number_must_be_an_integer():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload([
            'dev_front_number' => 'two',
        ]));

        $response->assertStatus(422);
    }

    public function test_dev_front_number_must_be_at_least_1():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload([
            'dev_front_number' => 0,
        ]));

        $response->assertStatus(422);
    }

    public function test_dev_back_number_must_be_an_integer():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload([
            'dev_back_number' => 'two',
        ]));

        $response->assertStatus(422);
    }

    public function test_dev_back_number_must_be_at_least_1():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload([
            'dev_back_number' => 0,
        ]));

        $response->assertStatus(422);
    }

    public function test_description_is_required():void{
        Sanctum::actingAs($this->userOne);

        $payload = $this->validProjectPayload();
        unset($payload['description']);
        $response = $this->postJson('/api/codeconnect/', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['description']);
    }

    public function test_dev_front_number_is_required():void{
        Sanctum::actingAs($this->userOne);

        $payload = $this->validProjectPayload();
        unset($payload['dev_front_number']);
        $response = $this->postJson('/api/codeconnect/', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['dev_front_number']);
    }

    public function test_dev_back_number_is_required():void{
        Sanctum::actingAs($this->userOne);

        $payload = $this->validProjectPayload();
        unset($payload['dev_back_number']);
        $response = $this->postJson('/api/codeconnect/', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['dev_back_number']);
    }

    public function test_store_accepts_new_frontend_languages():void{
        Sanctum::actingAs($this->userOne);

        foreach([LanguageEnum::Angular, LanguageEnum::Svelte, LanguageEnum::Vue] as $language){
            $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload([
                'language_frontend' => $language->value,
            ]));

            $response->assertStatus(201);
        }
    }

    public function test_store_accept_node_as_backend_language():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload([
            'language_backend' => LanguageEnum::Node->value,
        ]));

        $response->assertStatus(201);
    }

    private function validProjectPayload(array $overrides =[]):array{
        return array_merge([
            'title' => 'Projecte Epsilon',
            'description' => 'Descripció del projecte',
            'limit_date_inscription' => '2026-12-31',
            'dev_front_number' => 1,
            'dev_back_number' => 1,
            'time_duration' => '1 mes',
            'language_backend' => LanguageEnum::PHP->value,
            'language_frontend' => LanguageEnum::JavaScript->value,
            'programming_role' => 'Backend Developer',
        ], $overrides);
    }

    public function test_store_saves_roadmap_as_array():void{

        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload([
                'roadmap' => [
                    ['task' => 'Setup project', 'done' => false],
                ],
        ]));

        $response->assertStatus(201);
        $project = ListProjects::where('title', 'Projecte Epsilon')->firstOrFail();
        $this->assertIsArray($project->roadmap);
        $this->assertEquals('Setup project', $project->roadmap[0]['task']);
    }

    public function test_roadmap_must_be_an_array():void{
        Sanctum::actingAs($this->userOne);

        $response = $this->postJson('/api/codeconnect/', $this->validProjectPayload([
            'roadmap' => 'not-an-array',
        ]));

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['roadmap']);
    }
}
