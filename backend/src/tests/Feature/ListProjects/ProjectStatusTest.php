<?php

declare(strict_types=1);

namespace Tests\Feature\ListProjects;

use App\Enums\ProjectStatusEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class ProjectStatusTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_status_column_exists(): void
    {
        $this->assertTrue(Schema::hasColumn('list_projects', 'status'));
    }

    public function test_status_default_is_in_progress(): void
    {
        $owner = \App\Models\User::first() ?? \App\Models\User::factory()->create();
        $project = \App\Models\ListProjects::create([
            'user_id' => $owner->id,
            'title' => 'Test Project',
            'time_duration' => '1 month',
            'language_backend' => 'PHP',
            'language_frontend' => 'JavaScript',
            'dev_front_number' => 1,
            'dev_back_number' => 1,
        ]);

        $project->refresh();
        
        $this->assertEquals(ProjectStatusEnum::IN_PROGRESS, $project->status);
    }
}
