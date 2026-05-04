<?php
declare(strict_types=1);

namespace Tests\Unit;

use App\Models\Liga;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use PHPUnit\Framework\TestCase;

class LigaModelTest extends TestCase
{
    public function testPointsIsCastToInteger(): void
    {
        $liga = new Liga();

        $this->assertArrayHasKey('points', $liga->getCasts());
        $this->assertEquals('integer', $liga->getCasts()['points']);
    }

    public function testLigaEntryRelationOnUserReturnsHasOne(): void
    {
    $reflection = new \ReflectionMethod(User::class, 'ligaEntry');
    $returnType = $reflection->getReturnType()->getName();

    $this->assertEquals(HasOne::class, $returnType);
    }

}

