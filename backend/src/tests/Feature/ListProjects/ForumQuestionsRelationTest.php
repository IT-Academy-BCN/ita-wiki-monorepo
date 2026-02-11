<?php

namespace Tests\Unit\ListProjects;

use Tests\TestCase;
use App\Models\ListProjects;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Relation;

class ForumQuestionsRelationTest extends TestCase
{
    /** @test */
    public function it_has_a_forum_questions_relation(): void
    {
        Relation::noConstraints(function () {
            $project = new ListProjects();
            $this->assertInstanceOf(HasMany::class, $project->forumQuestions());
        });
    }
}

