<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Models\LigaPointHistory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use PHPUnit\Framework\TestCase;

class LigaPointHistoryModelTest extends TestCase
{
    public function testPointsIsCastToInteger(): void
    {
        $model = new LigaPointHistory();

        $this->assertArrayHasKey('points', $model->getCasts());
        $this->assertEquals('integer', $model->getCasts()['points']);
    }

    public function testFillableContainsExpectedFields(): void
    {
        $model = new LigaPointHistory();

        $this->assertContains('user_id', $model->getFillable());
        $this->assertContains('points', $model->getFillable());
        $this->assertContains('activity', $model->getFillable());
    }

    public function testUserRelationReturnsBelongsTo(): void
    {
        $reflection = new \ReflectionMethod(LigaPointHistory::class, 'user');
        $returnType = $reflection->getReturnType()->getName();

        $this->assertEquals(BelongsTo::class, $returnType);
    }
}
